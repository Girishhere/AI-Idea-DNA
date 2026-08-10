"""Test all scoring hierarchy rules."""
import urllib.request, json

tests = [
    ("Step A - Junk (too short)", "hello world"),
    ("Step B - Explicit Cliche", "i want to build a ai bot"),
    ("Step D - Vague (5-18 words)", "a system that uses machine learning for prediction"),
    ("Step E - Standard (detailed)", "A federated learning platform that trains distributed neural networks across hospital databases to predict rare genetic disorders while preserving patient privacy using differential privacy and homomorphic encryption techniques"),
]

for name, idea in tests:
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/analyze",
        data=json.dumps({"idea": idea}).encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        r = urllib.request.urlopen(req)
        data = json.loads(r.read())
        print(f"--- {name} ---")
        print(f'  Input: "{idea}"')
        print(f"  Novelty Score: {data['novelty_score']}")
        print(f"  Recommendation: {data.get('recommendation', 'None')}")
        print()
    except Exception as e:
        print(f"--- {name} ---")
        print(f"  ERROR: {e}")
        print()
