import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <nav className="flex items-center justify-center space-x-1 mt-4">
            {links.map((link, index) => {
                if (!link.url) return (
                    <span key={index} className="px-4 py-2 text-gray-500" dangerouslySetInnerHTML={{ __html: link.label }} />
                );

                return (
                    <Link
                        preserveScroll
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            link.active
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}