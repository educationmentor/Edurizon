import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

export const TransitionLink = ({ href, children, ...props }: TransitionLinkProps) => {
  const router = useRouter();
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    document.body.classList.add("page-transition");
    await new Promise((resolve) => setTimeout(resolve, 200));

    await router.push(href);

    await new Promise((resolve) => setTimeout(resolve, 200));
    document.body.classList.remove("page-transition");
  };

  const handleTransitionMobile = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    document.body.classList.add("page-transition-mobile");
    await new Promise((resolve) => setTimeout(resolve, 150));

    await router.push(href);

    document.body.classList.remove("page-transition-mobile");
  };

  return (
    <Link onClick={width > 768 ? handleTransition : handleTransitionMobile} href={href} {...props}>
      {children}
    </Link>
  );
};
