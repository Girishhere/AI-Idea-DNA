import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

def rebuild_index():
    assets_dir = os.path.join("app", "ml_assets")
    model_path = os.path.join(assets_dir, "saved_dna_model")
    metadata_path = os.path.join(assets_dir, "projects_metadata.json")
    index_path = os.path.join(assets_dir, "project_dna_faiss.index")

    print(f"Loading SentenceTransformer model from {model_path}...")
    model = SentenceTransformer(model_path)
    dim = model.get_sentence_embedding_dimension()
    print(f"Model loaded. Dimension: {dim}")

    print(f"Loading metadata from {metadata_path}...")
    with open(metadata_path, "r", encoding="utf-8") as f:
        projects = json.load(f)
    print(f"Loaded {len(projects)} projects.")

    print("Generating embeddings...")
    texts = [p["title"] + ". " + p["description"] for p in projects]
    embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True, show_progress_bar=True)
    embeddings = embeddings.astype(np.float32)

    print("Building FAISS index...")
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    print(f"Index created with {index.ntotal} vectors.")

    print(f"Saving index to {index_path}...")
    faiss.write_index(index, index_path)
    print("Done!")

if __name__ == "__main__":
    rebuild_index()
