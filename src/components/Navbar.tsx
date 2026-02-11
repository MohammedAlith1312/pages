import Link from "next/link";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import navbarData from "../../lib/navbar.json";

export default function Navbar() {
    const {
        background_color,
        text_color,
        logo,
        menu_items,
        search_bar,
        auth_buttons,
    } = navbarData;

    return (
        <nav
            className="sticky top-0 z-50 w-full px-6 py-4 transition-all duration-300"
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center">
                        {logo.type === "image" && (logo as any).image ? (
                            <Image
                                src={(logo as any).image}
                                alt="Logo"
                                width={(logo as any).width || 120}
                                height={40}
                                className="object-contain"
                            />
                        ) : (
                            <span className="text-2xl font-bold tracking-tight">
                                {logo.text || "Website"}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Menu Items */}
                <div className="hidden md:flex items-center space-x-8">
                    {menu_items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            className="text-sm font-medium hover:opacity-70 transition-opacity "
                            target="_blank"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right Section: Search & Auth */}
                <div className="flex items-center space-x-4">
                    <div className="relative hidden sm:block">
                        <FiSearch
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            size={18}
                            style={{ color: (search_bar as any).text_color || "#666" }}
                        />
                        <input
                            type="text"
                            placeholder={search_bar.placeholder}
                            className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                            style={{
                                width: `${(search_bar as any).width || 12}rem`,
                                backgroundColor: (search_bar as any).background_color,
                                color: (search_bar as any).text_color,
                            }}
                        />
                    </div>

                    <div className="flex items-center space-x-3 text-sm font-medium">
                        <Link
                            href={auth_buttons.login_button.link}
                            className="px-4 py-2 rounded-full transition-all hover:opacity-90"
                            style={{
                                backgroundColor: (auth_buttons.login_button as any).background_color,
                                color: (auth_buttons.login_button as any).text_color,
                                borderRadius: "10px"

                            }}
                        >
                            {auth_buttons.login_button.text}
                        </Link>
                        <Link
                            href={auth_buttons.signup_button.link}
                            className="px-4 py-2 rounded-full transition-all hover:opacity-90"
                            style={{
                                backgroundColor: (auth_buttons.signup_button as any).background_color,
                                color: (auth_buttons.signup_button as any).text_color,
                                borderRadius: "10px"

                            }}
                        >
                            {auth_buttons.signup_button.text}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
