class KnowledgeGraph:
    def __init__(self):
        # Store internal relationships as triple tuple sets (Subject, Predicate, Object)
        self.graph = set([
            ("Rudra", "works_on", "JARVIS X"),
            ("JARVIS X", "uses", "FastAPI"),
            ("Rudra", "likes", "RCB"),
            ("JARVIS X", "engine", "Python")
        ])

    def add_relation(self, subject: str, predicate: str, obj: str):
        relationship = (subject.strip(), predicate.strip(), obj.strip())
        self.graph.add(relationship)
        print(f"[Knowledge Graph] Added Relationship: {subject} -> {predicate} -> {obj}")
        return True

    def query_relations(self, subject_query: str = None, predicate_query: str = None, object_query: str = None):
        results = []
        for s, p, o in self.graph:
            if subject_query and subject_query.lower() not in s.lower():
                continue
            if predicate_query and predicate_query.lower() not in p.lower():
                continue
            if object_query and object_query.lower() not in o.lower():
                continue
            results.append((s, p, o))
        return results

    def get_all_concepts(self):
        concepts = set()
        for s, _, o in self.graph:
            concepts.add(s)
            concepts.add(o)
        return list(concepts)
