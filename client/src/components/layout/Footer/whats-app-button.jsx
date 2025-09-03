// WhatsAppButton.jsx
import React from "react";

export default function WhatsAppButton({ phone = "201010955331" }) {
    const href = `https://wa.me/${phone}`;

    return (
        <div className="fixed bottom-4 right-4 z-50 group">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="
          w-14 h-14 
          rounded-full 
          bg-[#25D366] 
          flex items-center justify-center 
          shadow-lg 
          hover:scale-110 hover:shadow-xl 
          transition-transform duration-200
        "
            >
                <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-7 h-7 fill-white"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-1.758-.867-2.905-1.548-4.073-3.52-.307-.53.307-.493.88-1.638.099-.198.05-.371-.025-.52-.075-.148-.67-1.612-.918-2.21-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.79.372s-1.04 1.016-1.04 2.479 1.065 2.87 1.213 3.07c.148.198 2.095 3.2 5.076 4.487  .709.306 1.26.49 1.69.626.71.226 1.36.194 1.87.118.57-.085 1.758-.72 2.01-1.415.253-.695.253-1.29.176-1.415-.075-.124-.272-.198-.57-.347z" />
                    <path d="M20.52 3.48A11.9 11.9 0 0 0 12 .04C6.06.04.96 5.14.96 11.08c0 1.95.51 3.86 1.48 5.54L.06 23l6.66-1.75A11 11 0 0 0 12 22c5.94 0 11.04-5.1 11.04-11.04 0-2.95-1.14-5.69-2.52-7.48zM12 20.12c-1.05 0-2.08-.28-2.98-.82l-.21-.13-3.96 1.04 1.06-3.86-.14-.22A8.94 8.94 0 0 1 3.06 11.08 8.94 8.94 0 0 1 12 2.2c4.95 0 9 4.05 9 8.88S16.95 20.12 12 20.12z" />
                </svg>
            </a>

            {/* Tooltip */}
            <span
                className="
          absolute right-16 bottom-1/2 translate-y-1/2 
          bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-md
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-200
          pointer-events-none
        "
            >
                تواصل معنا
            </span>
        </div>
    );
}
