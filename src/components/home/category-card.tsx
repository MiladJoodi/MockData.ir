import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  href: string;
  title: string;
  meta?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function CategoryCard({
  href,
  title,
  meta,
  imageSrc = "/placeholders/users.png",
  imageAlt = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2.5 text-center transition-opacity hover:opacity-80"
    >
      <div className="relative flex aspect-square w-full max-w-[88px] items-center justify-center sm:max-w-[96px]">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          width={96}
          height={96}
          className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          priority
        />
      </div>
      <span className="text-[13px] font-normal tracking-tight text-foreground">
        {title}
        {meta ? (
          <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
