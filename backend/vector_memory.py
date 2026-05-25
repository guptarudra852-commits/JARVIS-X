import chromadb

client = chromadb.Client()

collection = client.get_or_create_collection(
    name="jarvis_memory"
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
