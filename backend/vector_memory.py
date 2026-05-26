import chromadb

client = chromadb.PersistentClient(
    path="./knowledge_db"
)

collection = client.get_or_create_collection(
    name="jarvis_knowledge"
)

def save_vector_memory(content):

    collection.add(

        documents=[content],

        ids=[
            str(
                collection.count()+1
            )
        ]
    )

    print(
        "Vector Memory Saved"
    )

def search_memory(query):

    results = collection.query(

        query_texts=[query],

        n_results=3
    )

    return results["documents"]
