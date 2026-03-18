/** Encode a Mermaid source string into a URL-safe base64 string. */
export const encodeDiagram = (source: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(source)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Decode a URL-safe base64 string back to Mermaid source, or return null on failure. */
export const decodeDiagram = (encoded: string): string | null => {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    return decodeURIComponent(escape(atob(base64)))
  } catch {
    return null
  }
}
