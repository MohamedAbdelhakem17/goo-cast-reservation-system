import { Shield, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-[500]">
            <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl text-main font-bold">
                            <Link href="/">
                                Goocast Studio</Link>
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 mt-1">Professional studio booking</p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>500+ Sessions</span>
                        </div>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            <span>4.9 Rating</span>
                        </div>
                        <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-1 text-green-600" />
                            <span>Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
