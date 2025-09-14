import { Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { logo } from "../../../assets/images";
import { OptimizedImage } from "../../common";
export default function Header() {
  return (
    <div className="sticky top-0 z-[500] border-b border-gray-200 bg-white">
      <div className="mx-auto w-full px-4 py-4 lg:max-w-6xl lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-main text-2xl font-bold md:text-3xl">
              <Link to="/">
                <OptimizedImage src={logo} alt="Goocast" className="w-36" />
              </Link>
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              Easy podcasting for everyone
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="hidden items-center space-x-6 text-sm text-gray-600 md:flex">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>500+ Sessions</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 text-yellow-500" />
              <span>4.9 Rating</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-1 h-4 w-4 text-green-600" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
