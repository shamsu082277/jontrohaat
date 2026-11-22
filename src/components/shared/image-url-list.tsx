"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafeImage } from "@/components/shared/safe-image";

interface ImageUrlListProps {
  value: string[];
  onChange: (value: string[]) => void;
  onValidityChange: (valid: boolean) => void;
  label: string;
  helperText?: string;
  maxItems?: number;
  allowEmpty?: boolean;
}

export function isSecureImageUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function ImageUrlList({
  value,
  onChange,
  onValidityChange,
  label,
  helperText = "Paste a direct HTTPS image URL from an external image host.",
  maxItems = 10,
  allowEmpty = false,
}: ImageUrlListProps) {
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState("");
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(() => new Set());
  const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set());

  const notifyValidity = (urls: string[], loaded: Set<string>) => {
    onValidityChange(
      (allowEmpty && urls.length === 0) ||
        (urls.length > 0 &&
          urls.every((url) => isSecureImageUrl(url) && loaded.has(url)))
    );
  };

  const addUrl = () => {
    const url = newUrl.trim();
    if (!isSecureImageUrl(url)) {
      setError("Enter a valid HTTPS image URL.");
      return;
    }
    if (value.includes(url)) {
      setError("That image URL is already in the list.");
      return;
    }
    if (value.length >= maxItems) {
      setError(`You can add up to ${maxItems} images.`);
      return;
    }

    const next = [...value, url];
    setError("");
    setNewUrl("");
    onChange(next);
    notifyValidity(next, loadedUrls);
  };

  const updateUrl = (index: number, rawUrl: string) => {
    const next = value.map((url, currentIndex) =>
      currentIndex === index ? rawUrl : url
    );
    const nextLoaded = new Set(loadedUrls);
    nextLoaded.delete(value[index]);
    const nextFailed = new Set(failedUrls);
    nextFailed.delete(value[index]);
    setLoadedUrls(nextLoaded);
    setFailedUrls(nextFailed);
    onChange(next);
    notifyValidity(next, nextLoaded);
  };

  const removeUrl = (index: number) => {
    const next = value.filter((_, currentIndex) => currentIndex !== index);
    const nextLoaded = new Set(loadedUrls);
    nextLoaded.delete(value[index]);
    const nextFailed = new Set(failedUrls);
    nextFailed.delete(value[index]);
    setLoadedUrls(nextLoaded);
    setFailedUrls(nextFailed);
    setError("");
    onChange(next);
    notifyValidity(next, nextLoaded);
  };

  const markLoaded = (url: string, loaded: boolean) => {
    const nextLoaded = new Set(loadedUrls);
    if (loaded) nextLoaded.add(url);
    else nextLoaded.delete(url);
    const nextFailed = new Set(failedUrls);
    if (loaded) nextFailed.delete(url);
    else nextFailed.add(url);
    setLoadedUrls(nextLoaded);
    setFailedUrls(nextFailed);
    notifyValidity(value, nextLoaded);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        <p className="text-[11px] text-muted-foreground">{helperText}</p>
      </div>

      {value.map((url, index) => {
        const validUrl = isSecureImageUrl(url);
        const loaded = loadedUrls.has(url);
        const failed = failedUrls.has(url);
        return (
          <div
            key={`${index}-${url}`}
            className="grid grid-cols-[5rem_minmax(0,1fr)_2.5rem] items-center gap-3 rounded-xl border border-border p-3"
          >
            <div className="relative h-16 w-20 overflow-hidden rounded-lg bg-muted">
              {validUrl ? (
                <SafeImage
                  src={url}
                  alt={`Image preview ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  onLoad={() => markLoaded(url, true)}
                  onError={() => markLoaded(url, false)}
                />
              ) : (
                <SafeImage src="" alt="Image unavailable" fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <Input
                type="url"
                value={url}
                onChange={(event) => updateUrl(index, event.target.value)}
                aria-label={`Image URL ${index + 1}`}
                placeholder="https://..."
                className="text-xs"
              />
              {!validUrl ? (
                <p className="text-[11px] text-destructive">Use a valid HTTPS URL.</p>
              ) : loaded ? (
                <p className="text-[11px] text-brand-leaf">Image preview loaded.</p>
              ) : failed ? (
                <p className="text-[11px] text-destructive">Image could not be reached. Try another URL.</p>
              ) : (
                <p className="text-[11px] text-amber-600">Checking image URL…</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove image ${index + 1}`}
              onClick={() => removeUrl(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      {value.length < maxItems && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="url"
            value={newUrl}
            onChange={(event) => {
              setNewUrl(event.target.value);
              if (error) setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addUrl();
              }
            }}
            aria-label="Add image URL"
            placeholder="https://image-host.example/image.jpg"
            className="text-xs"
          />
          <Button type="button" variant="outline" onClick={addUrl} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            Add URL
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
