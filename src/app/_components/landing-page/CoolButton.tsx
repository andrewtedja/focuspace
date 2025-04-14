"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MousePointerClick } from "lucide-react";

interface TestButtonProps {
  children?: React.ReactNode;
  colors?: {
    from: string;
    via?: string;
    to: string;
  };
  href?: string;
}

const TestButton: React.FC<TestButtonProps> = ({
  children = "Get Started",
  colors = {
    from: "#86B3D1",
    via: "#000000",
    to: "#89AB9E",
  },
  href,
}) => {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0.5, y: 0.5 });
  };

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const handleOnClick = () => {
    if (href) {
      router.push(href);
    }
  };

  const calculateTransform = () => {
    if (!isHovering && !isActive)
      return {
        transform:
          "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      };

    const centerX = position.x - 0.5;
    const centerY = position.y - 0.5;

    const maxRotation = isActive ? 10 : 20;
    const rotateY = centerX * maxRotation;
    const rotateX = -centerY * maxRotation;

    const pushIntensity = isActive ? 10 : 15;

    const distanceFromCenter = Math.sqrt(centerX * centerX + centerY * centerY);
    const zPush = -distanceFromCenter * pushIntensity;

    return {
      transform: `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${zPush}px)`,
      boxShadow: isActive
        ? "0px 10px 20px rgba(0, 0, 0, 0.2)"
        : "0px 25px 50px rgba(0, 0, 0, 0.25), 0px 10px 20px rgba(0, 0, 0, 0.15)",
      transition:
        isHovering || isActive
          ? "transform 0.08s ease-out"
          : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    };
  };

  const calculateDotPosition = () => {
    if (!isHovering) return { top: "50%", left: "50%", opacity: 0 };

    return {
      left: `${position.x * 100}%`,
      top: `${position.y * 100}%`,
      opacity: 0.9,
      transition: "opacity 0.1s ease-out",
    };
  };

  const calculateSurfaceLighting = () => {
    if (!isHovering)
      return {
        background: `linear-gradient(145deg, ${colors.from}, ${colors.to})`,
      };

    const centerX = position.x;
    const centerY = position.y;

    const angle = Math.atan2(centerY - 0.5, centerX - 0.5) * (180 / Math.PI);
    const gradientAngle = angle - 90;

    return {
      background: `linear-gradient(${gradientAngle}deg, ${colors.from}, ${colors.via}, ${colors.to} 100%)`,
    };
  };

  const calculateInnerShadow = () => {
    if (!isHovering) return { boxShadow: "none", opacity: 0 };

    const centerX = position.x;
    const centerY = position.y;

    const x = (0.5 - centerX) * 20;
    const y = (0.5 - centerY) * 20;

    return {
      boxShadow: `${x}px ${y}px 20px rgba(0, 0, 0, 0.4) inset, 
                 ${-x / 2}px ${-y / 2}px 20px rgba(255, 255, 255, 0.1) inset`,
      opacity: 0.1,
      transition: "opacity 0.2s ease",
    };
  };

  return (
    <div className="relative flex cursor-pointer items-center justify-center p-8">
      <div
        className="absolute rounded-full bg-[#86B3D1] opacity-30 blur-xl"
        style={{
          width: "340px",
          height: "140px",
          transform: isHovering
            ? `translateY(30px) scale(${1 + Math.abs(position.x - 0.5) * 0.4}, 1)`
            : "translateY(25px)",
          zIndex: -1,
          transition: "all 0.3s ease",
        }}
      />

      <div
        ref={buttonRef}
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-[#86B3D1] px-8 py-6"
        style={{
          ...calculateTransform(),
          ...calculateSurfaceLighting(),
          width: "600px",
          height: "140px",
          border: "1px solid rgba(255, 255, 255, 1)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleOnClick}
      >
        <div className="relative flex items-center justify-center break-words">
          <div className="mr-4 text-6xl font-medium text-white">{children}</div>
          <MousePointerClick className="h-12 w-12 text-white" />
        </div>

        <div
          className="pointer-events-none absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/20"
          style={{
            ...calculateDotPosition(),
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 20%)",
            width: "200px",
            height: "200px",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            ...calculateInnerShadow(),
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: isHovering
              ? `radial-gradient(circle at ${(1 - position.x) * 100}% ${(1 - position.y) * 100}%, rgba(255,255,255,0.2), transparent 80%)`
              : "none",
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>
    </div>
  );
};

export default TestButton;
