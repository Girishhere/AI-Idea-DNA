"""
============================================================
AI Idea DNA — FAISS Vector Similarity Service (Real Inference)
============================================================
Uses a pretrained SentenceTransformer model to encode project
ideas into 384-dimensional embeddings, and a pre-built FAISS
index of existing student projects for similarity search.

Assets loaded from app/ml_assets/:
  - saved_dna_model/     : SentenceTransformer weights (BertModel)
  - project_dna_faiss.index : Pre-computed FAISS vector index
  - projects_metadata.json  : Titles, domains, descriptions for each vector
"""

import os
import json
import numpy as np
import faiss
from typing import List, Dict, Tuple

from app.config import settings


class FAISSService:
    """
    Production-grade FAISS service that:
    1. Loads a pretrained SentenceTransformer model for real embeddings
    2. Loads a pre-built FAISS index from disk
    3. Loads project metadata to map indices to project info
    4. Provides semantic similarity search for incoming ideas
    """

    def __init__(self):
        self.dim = settings.EMBEDDING_DIM          # 384 for MiniLM
        self.index: faiss.Index = None              # FAISS index loaded from file
        self.projects: List[Dict[str, str]] = []    # Metadata for indexed projects
        self.model = None                           # SentenceTransformer instance
        self._initialized = False

    def initialize(self):
        """
        Load all ML assets at application startup:
        1. SentenceTransformer model from saved_dna_model/
        2. FAISS index from project_dna_faiss.index
        3. Project metadata from projects_metadata.json
        """
        assets_dir = settings.ML_ASSETS_DIR

        # ── Step 1: Load the SentenceTransformer model ───────
        model_path = os.path.join(assets_dir, "saved_dna_model")
        if not os.path.isdir(model_path):
            raise FileNotFoundError(
                f"[FAISS] SentenceTransformer model not found at: {model_path}"
            )

        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_path)
        print(f"[FAISS] SentenceTransformer loaded from: {model_path}")
        print(f"[FAISS] Model embedding dimension: {self.model.get_sentence_embedding_dimension()}")

        # Validate dimension matches config
        actual_dim = self.model.get_sentence_embedding_dimension()
        if actual_dim != self.dim:
            print(f"[FAISS] WARNING: Model dim ({actual_dim}) != config dim ({self.dim}). Updating to {actual_dim}.")
            self.dim = actual_dim

        # ── Step 2: Load the FAISS index ─────────────────────
        index_path = os.path.join(assets_dir, "project_dna_faiss.index")
        if not os.path.isfile(index_path):
            raise FileNotFoundError(
                f"[FAISS] Index file not found at: {index_path}"
            )

        self.index = faiss.read_index(index_path)
        print(f"[FAISS] Index loaded: {self.index.ntotal} vectors, dim={self.index.d}")

        # ── Step 3: Load project metadata ────────────────────
        metadata_path = os.path.join(assets_dir, "projects_metadata.json")
        if not os.path.isfile(metadata_path):
            raise FileNotFoundError(
                f"[FAISS] Metadata file not found at: {metadata_path}"
            )

        with open(metadata_path, "r", encoding="utf-8") as f:
            self.projects = json.load(f)
        print(f"[FAISS] Loaded metadata for {len(self.projects)} projects")

        # Sanity check: number of metadata entries should match index size
        if len(self.projects) != self.index.ntotal:
            print(
                f"[FAISS] WARNING: Metadata count ({len(self.projects)}) "
                f"!= index count ({self.index.ntotal}). Results may be misaligned."
            )

        self._initialized = True
        print(f"[FAISS] Service fully initialized and ready for inference")

    def encode_text(self, text: str) -> np.ndarray:
        """
        Convert a text string into a real 384-dimensional embedding
        using the loaded SentenceTransformer model.

        Args:
            text: Input text to encode

        Returns:
            numpy array of shape (EMBEDDING_DIM,) — L2-normalized
        """
        if self.model is None:
            raise RuntimeError("[FAISS] Model not loaded. Call initialize() first.")

        # SentenceTransformer.encode returns a numpy array
        # The model pipeline already includes Normalize as module 2
        embedding = self.model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True,   # Ensure unit-norm vectors
            show_progress_bar=False,
        )

        return embedding.astype(np.float32)

    def search_similar(
        self,
        query_text: str,
        k: int = None,
    ) -> List[Tuple[Dict[str, str], float]]:
        """
        Search the FAISS index for the k most similar projects
        using real SentenceTransformer embeddings.

        Args:
            query_text: The idea text to search against
            k: Number of results to return (defaults to config value)

        Returns:
            List of (project_dict, distance) tuples.
            Lower distance = more similar.
            For normalized vectors with IndexFlatL2, distance range is [0, 4].
            distance = 0 means identical, distance = 2 means orthogonal.
        """
        if not self._initialized:
            self.initialize()

        if k is None:
            k = settings.FAISS_TOP_K

        # Ensure k doesn't exceed index size
        k = min(k, self.index.ntotal)

        # Encode query text to a real embedding vector
        query_vec = self.encode_text(query_text).reshape(1, -1)

        # Search the pre-built FAISS index
        distances, indices = self.index.search(query_vec, k)

        # Build results list with metadata
        results = []
        for i, idx in enumerate(indices[0]):
            if 0 <= idx < len(self.projects):
                results.append((
                    self.projects[idx],
                    float(distances[0][i]),
                ))

        return results


# ── Module-level singleton ───────────────────────────────────
faiss_service = FAISSService()
