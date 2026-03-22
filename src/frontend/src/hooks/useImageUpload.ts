import { HttpAgent } from "@icp-sdk/core/agent";
import { useRef, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number; previewUrl: string }
  | { status: "done"; url: string; previewUrl: string }
  | { status: "error"; message: string; previewUrl: string };

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
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

  const uploadImage = async (
    file: File,
    onSuccess: (url: string) => void,
    onError: (message: string) => void,
  ): Promise<void> => {
    const previewUrl = URL.createObjectURL(file);
    setState({ status: "uploading", progress: 0, previewUrl });
    try {
      const client = await getClient();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) => {
        setState({ status: "uploading", progress: pct, previewUrl });
      });
      const url = await client.getDirectURL(hash);
      setState({ status: "done", url, previewUrl });
      onSuccess(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ status: "error", message, previewUrl });
      onError(message);
    }
  };

  const reset = () => {
    setState({ status: "idle" });
  };

  return { state, uploadImage, reset };
}
