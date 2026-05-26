import chromadb

client=chromadb.PersistentClient(
path="./knowledge_db"
)

collection=client.get_or_create_collection(
name="jarvis_data"
)

def save_chunks(chunks):

    for i,chunk in enumerate(chunks):

        collection.add(

            documents=[chunk],

            ids=[str(i)]

        )
