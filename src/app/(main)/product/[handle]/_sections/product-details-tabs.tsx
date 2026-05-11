"use client"

import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  HeartIcon,
  PencilSquareIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline"

import { Tabs } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"
import type { Product, ProductDownloadFile } from "@/lib/integrations/shopify/types"

type ProductDetailsTabsProps = {
  product: Product
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DownloadItem({ file }: { file: ProductDownloadFile }) {
  const label = file.alt ?? "Download"
  const ext = file.mimeType?.split("/").pop()?.toUpperCase() ?? ""
  const size = formatFileSize(file.originalFileSize)

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="group flex items-center justify-between gap-6 border-b border-zinc-100 py-4 transition-colors duration-200 last:border-0 hover:bg-zinc-50 -mx-4 px-4"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-400 transition-colors duration-200 group-hover:border-zinc-800 group-hover:text-zinc-800">
          <DocumentTextIcon className="size-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <Text as="span" className="text-sm font-semibold text-zinc-800 leading-tight">
            {label}
          </Text>
          {(ext || size) && (
            <Text as="span" className="text-xs text-zinc-400 uppercase tracking-wider">
              {[ext, size].filter(Boolean).join(" · ")}
            </Text>
          )}
        </div>
      </div>
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-zinc-400 transition-colors duration-200 group-hover:text-zinc-900">
        <ArrowDownTrayIcon className="size-4" />
        Download
      </span>
    </a>
  )
}

function DownloadsContent({ downloads }: { downloads: ProductDownloadFile[] }) {
  if (!downloads.length) {
    return (
      <Text as="p" className="text-sm text-zinc-400 py-2">
        No downloadable files available for this product.
      </Text>
    )
  }

  return (
    <div className="flex flex-col">
      {downloads.map((file) => (
        <DownloadItem key={file.id} file={file} />
      ))}
    </div>
  )
}

function CompositionContent() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Text as="h4" className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
          Materials
        </Text>
        <ul className="flex flex-col gap-3">
          {[
            { label: "Pile", value: "100% New Zealand Wool" },
            { label: "Foundation", value: "Cotton warp & weft" },
            { label: "Backing", value: "Natural latex" },
          ].map(({ label, value }) => (
            <li key={label} className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3">
              <Text as="span" className="text-sm text-zinc-400 shrink-0">{label}</Text>
              <Text as="span" className="text-sm font-semibold text-zinc-800 text-right">{value}</Text>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <Text as="h4" className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
          Available Colorways
        </Text>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Ivory", hex: "#F5F0E8" },
            { name: "Sand", hex: "#C9B89A" },
            { name: "Slate", hex: "#8A9BA8" },
            { name: "Charcoal", hex: "#3D3D3D" },
            { name: "Terracotta", hex: "#C27B5A" },
            { name: "Forest", hex: "#4A6741" },
          ].map(({ name, hex }) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <span
                className="size-8 rounded-full border border-zinc-200 shadow-sm"
                style={{ backgroundColor: hex }}
              />
              <Text as="span" className="text-xs text-zinc-400">{name}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CareContent() {
  const instructions = [
    { step: "01", title: "Vacuum regularly", body: "Vacuum in the direction of the pile using a low-suction setting. Avoid beater-bar attachments." },
    { step: "02", title: "Rotate periodically", body: "Rotate the rug every 6–12 months to ensure even wear and prevent fading from directional light." },
    { step: "03", title: "Spot clean immediately", body: "Blot — never rub — spills with a clean white cloth. Use a mild wool-safe detergent diluted in cold water." },
    { step: "04", title: "Professional cleaning", body: "For deep cleaning, consult a professional rug cleaner experienced with hand-knotted wool pieces." },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {instructions.map(({ step, title, body }) => (
        <div key={step} className="flex gap-4">
          <Text as="span" className="text-xs font-semibold tracking-widest text-zinc-300 pt-0.5 shrink-0 w-6">
            {step}
          </Text>
          <div className="flex flex-col gap-1">
            <Text as="h4" className="text-sm font-semibold text-zinc-800">{title}</Text>
            <Text as="p" className="text-sm text-zinc-400 leading-relaxed">{body}</Text>
          </div>
        </div>
      ))}
    </div>
  )
}

function CustomizationContent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 max-w-xl">
        <Text as="p" className="text-sm text-zinc-500 leading-relaxed">
          Every piece can be adapted to your space. We offer bespoke sizing, custom colorways, and
          tailored knotting densities. Lead times for custom orders range from 12 to 24 weeks
          depending on complexity.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Custom Size", description: "Any dimension, from runner to room-size" },
          { label: "Color Palette", description: "Select from our archive or provide a reference" },
          { label: "Pile Height", description: "Low, medium, or high-pile construction" },
        ].map(({ label, description }) => (
          <div
            key={label}
            className="flex flex-col gap-2 border border-zinc-100 p-5 rounded-sm"
          >
            <Text as="h4" className="text-xs uppercase tracking-widest font-semibold text-zinc-800">
              {label}
            </Text>
            <Text as="p" className="text-sm text-zinc-400 leading-relaxed">
              {description}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  return (
    <section className="py-16">
      <Tabs mode="single" orientation="vertical" defaultOpen="downloads">
        <Tabs.List>
          <Tabs.Trigger id="downloads" icon={<ArrowDownTrayIcon className="size-4" />}>
            Downloads
          </Tabs.Trigger>
          <Tabs.Trigger id="composition" icon={<SwatchIcon className="size-4" />}>
            Composition & Color
          </Tabs.Trigger>
          <Tabs.Trigger id="care" icon={<HeartIcon className="size-4" />}>
            Care & Handling
          </Tabs.Trigger>
          <Tabs.Trigger id="customization" icon={<PencilSquareIcon className="size-4" />}>
            Customization
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content id="downloads">
          <DownloadsContent downloads={product.downloads} />
        </Tabs.Content>

        <Tabs.Content id="composition">
          <CompositionContent />
        </Tabs.Content>

        <Tabs.Content id="care">
          <CareContent />
        </Tabs.Content>

        <Tabs.Content id="customization">
          <CustomizationContent />
        </Tabs.Content>
      </Tabs>
    </section>
  )
}
