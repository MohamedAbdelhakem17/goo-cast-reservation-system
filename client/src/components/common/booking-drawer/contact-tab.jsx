import { Mail, MessageCircle, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactTab({ userProfile }) {
  if (!userProfile) return null;

  const { fullName, phone, email, _id } = userProfile; // assuming `id` exists for profile URL

  const whatsappLink = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}` : null;

  return (
    <div className="mt-6 space-y-6 rounded-lg bg-white p-4 shadow-md">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="mt-1 text-base font-medium text-gray-800">{fullName}</p>
        </div>

        {phone && (
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="mt-1 text-base text-gray-800">{phone}</p>
          </div>
        )}

        {email && (
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 text-base text-gray-800">{email}</p>
          </div>
        )}
      </div>

      <hr className="border-gray-300" />

      {/* Contact Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        )}

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:border-green-400 hover:bg-green-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}

        {_id && (
          <Link
            to={`/admin-dashboard/users/${_id}`} // replace with your profile URL
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <User className="h-4 w-4" />
            View Profile
          </Link>
        )}
      </div>
    </div>
  );
}
