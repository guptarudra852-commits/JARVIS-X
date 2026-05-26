# JARVIS X Cognitive Brain: World Model
# Connects facts, identities, concepts, and relationships into a unified semantic graph

initial_graph = [
    ("Captain Rudra", "builds", "JARVIS X"),
    ("JARVIS X", "uses", "Node.js Express"),
    ("JARVIS X", "uses", "FastAPI Python"),
    ("JARVIS X", "stores", "PostgreSQL database"),
    ("JARVIS X", "utilizes", "Cognitive Architecture vNext"),
    ("FastAPI Python", "hosts", "Cognitive Brain Model"),
    ("Node.js Express", "serves", "Holographic HUD Dashboard")
]

class WorldModel:
    def __init__(self):
        self.graph = initial_graph.copy()

    def get_relations(self) -> list:
        return self.graph

    def learn_relation(self, subject: str, predicate: str, target: str) -> None:
        """
        Learns physical/logical relationships dynamically.
        """
        # Avoid exact duplicates
        for s, p, t in self.graph:
            if s.lower() == subject.lower() and p.lower() == predicate.lower() and t.lower() == target.lower():
                return
        self.graph.append((subject, predicate, target))

    def query_relations(self, keyword: str) -> list:
        """
        Filters the map to find connected nodes.
        """
        term = keyword.lower()
        results = []
        for s, p, t in self.graph:
            if term in s.lower() or term in p.lower() or term in t.lower():
                results.append(f"{s} --({p})--> {t}")
        return results

    def run(self, task: str, context: dict = None) -> dict:
        context = context or {}
        sub = context.get("subject", "JARVIS X")
        pred = context.get("predicate", "optimizes")
        obj = context.get("object", "Human Coexistence")
        
        self.learn_relation(sub, pred, obj)
        
        return {
            "success": True,
            "engine": "WorldModel_Engine_vNext",
            "full_relationships_graph": self.graph,
            "queried_concept_match": self.query_relations(task if task else "JARVIS")
        }
