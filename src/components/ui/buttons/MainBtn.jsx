"use client";

import Link from "next/link";
import { memo } from "react";
import { motion } from "motion/react";
import RippleEffect from "@/components/ui/effects/RippleEffect";
import TextAnimation from "@/components/ui/text/TextAnimation";

export default memo(function MainBtn({
  children,
  className = "",

  to,
  href,
  onClick,

  variant = "main", // 'main', 'outline', 'ghost'
  size = "md", // 'sm', 'md', 'lg'

  type = "button",
  disabled = false,
  fullWidth = false,
  ...rest
}) {
  const variants = {
    main: "bg-gold text-bg hover:text-text duration-300",
    outline: "text-gold border-2 border-gold",
    ghost: "text-gold",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-xl",
  };

  const styles = `
    group relative rounded-md overflow-hidden
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : "w-fit"}
    ${
      disabled
        ? "opacity-50! cursor-not-allowed pointer-events-none"
        : "cursor-pointer"
    }
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const commonProps = {
    className: styles,
    disabled,
    ...rest,
  };

  const buttonContent = (
    <>
      <TextAnimation text={children} className="relative font-bold z-10" />
      <motion.div className="absolute inset-0 w-full h-full bg-indigo-500 pointer-events-none z-0 translate-y-full group-hover:translate-y-0 duration-300" />
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 200,
    },
  };

  if (to)
    return (
      <motion.div {...motionProps}>
        <Link href={to} {...commonProps}>
          {buttonContent}
        </Link>
      </motion.div>
    );

  if (href)
    return (
      <motion.div {...motionProps}>
        <a href={href} {...commonProps}>
          {buttonContent}
        </a>
      </motion.div>
    );

  return (
    <RippleEffect className={`relatiove font-sec ${className}`}>
      <motion.button
        {...motionProps}
        {...commonProps}
        type={type}
        onClick={onClick}
      >
        {buttonContent}
      </motion.button>
    </RippleEffect>
  );
});
