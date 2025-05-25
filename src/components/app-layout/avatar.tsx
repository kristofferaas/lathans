import Link from "next/link";

function AvatarSVG({ className }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.6885 0.636719C27.3206 0.636719 35.1297 8.44503 35.1299 18.0771C35.1299 23.3994 32.7447 28.1642 28.9863 31.3633C27.5793 28.5093 23.0556 26.4189 17.6885 26.4189C12.3213 26.419 7.79743 28.5093 6.39062 31.3633C2.63247 28.1642 0.248047 23.3992 0.248047 18.0771C0.248241 8.44515 8.05648 0.636913 17.6885 0.636719ZM17.6885 10.874C14.3383 10.8742 11.6221 13.5902 11.6221 16.9404C11.6223 20.2905 14.3384 23.0066 17.6885 23.0068C21.0387 23.0068 23.7547 20.2906 23.7549 16.9404C23.7549 13.5901 21.0388 10.874 17.6885 10.874Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Avatar({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="hover:bg-primary/10 flex size-10 cursor-default items-center justify-center rounded-full transition-colors"
    >
      <AvatarSVG className="size-8" />
    </Link>
  );
}
