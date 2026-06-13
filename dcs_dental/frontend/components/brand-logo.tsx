import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  showText = true,
  textClassName,
}: {
  className?: string
  showText?: boolean
  textClassName?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="DCS - Matériel dentaire et paramédical"
        width={120}
        height={40}
        priority
        className="h-9 w-auto rounded-md"
      />
      {showText && (
        <span className={cn("sr-only", textClassName)}>DCS Store</span>
      )}
    </span>
  )
}
