import { Pinecone } from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3.server'
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'

const apiKey = process.env.PINECONE_API_KEY

if (!apiKey) {
    throw new Error("Pinecone key is not provided in the env")
}

const pinecone = new Pinecone({
    apiKey: apiKey!
})

export async function loadS3IntoPinecone(fileKey: string) {
    //1. obtain the pdf -> downlaod and read from pdf
    console.log('downloading s3 into the file system')
    const file_name = await downloadFromS3(fileKey)
    if (!file_name) {
        throw new Error('Could not download from s3')
    }
    const loader = new PDFLoader(file_name)
    const pages = await loader.load()
    return pages
}