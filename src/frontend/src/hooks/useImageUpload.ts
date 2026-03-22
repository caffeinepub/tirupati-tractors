import { HttpAgent } from "@icp-sdk/core/agent";
import { useRef, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const clientRef = useRef<StorageClient | null>(null);

  const getClient = async (): Promise<StorageClient> => {
    if (clientRef.current) return clientRef.current;
    const config = await loadConfig();
    const agent = new HttpAgent({ host: config.backend_host });
    if (config.backend_host?.includes("localhost")) {
      await agent.fetchRootKey().catch(console.warn);
    }
    clientRef.current = new StorageClient(
      config.bucket_name,
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );
    return clientRef.current;
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const client = await getClient();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) => {
        setUploadProgress(pct);
      });
      const url = await client.getDirectURL(hash);
      return url;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return { uploadImage, isUploading, uploadProgress };
}
