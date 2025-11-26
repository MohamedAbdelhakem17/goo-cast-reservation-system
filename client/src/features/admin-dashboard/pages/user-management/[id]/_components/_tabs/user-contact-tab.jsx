import useLocalization from "@/context/localization-provider/localization-context";
import { FileText, Mail, MessageCircle, Phone, User } from "lucide-react";

export default function UserContactTab({ user }) {
  const { t } = useLocalization();

  return (
    <div className="space-y-6 [&_hr]:text-gray-300">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {t("contact-details")}
        </h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t("email-address")}</p>
              <p className="mt-1 text-sm font-medium break-words text-gray-800">
                {user.email || "N/A"}
              </p>
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="text-main mt-1 inline-block text-xs font-medium underline decoration-gray-300 decoration-1"
                >
                  {t("send-email")}
                </a>
              )}
            </div>
          </div>

          <hr />

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t("phone-number")}</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.phone || "N/A"}
              </p>
              {user.phone && (
                <a
                  href={`tel:${user.phone}`}
                  className="text-main mt-1 inline-block text-xs font-medium underline decoration-gray-300 decoration-1"
                >
                  {t("call-now")}
                </a>
              )}
            </div>
          </div>

          <hr />

          {/* Account Owner */}
          <div className="flex items-start gap-3">
            <User className="mt-1 h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t("account-owner")}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-main grid h-6 w-6 place-items-center rounded-full text-xs font-semibold text-white">
                  {user?.avatar || "NA"}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {user.tags?.length > 0 && (
            <>
              <hr />
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{t("tags")}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-main inline-flex items-center rounded-full border-transparent px-3 py-1 text-xs font-medium text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <hr className="my-6" />

        {/* Quick Actions */}
        <div>
          <p className="mb-3 text-sm font-medium text-gray-500">{t("quick-actions")}</p>
          <div className="grid grid-cols-3 gap-3">
            {user.phone && (
              <a
                href={`tel:${user.phone}`}
                className="border-main/30 text-main hover:bg-main/10 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition"
              >
                <Phone className="h-4 w-4" />
                {t("call")}
              </a>
            )}
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="border-main/30 text-main hover:bg-main/10 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition"
              >
                <Mail className="h-4 w-4" />
                {t("email")}
              </a>
            )}
            {user.phone && (
              <a
                href={`https://wa.me/${user.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-main/30 text-main hover:bg-main/10 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition"
              >
                <MessageCircle className="h-4 w-4" />
                {t("whatsapp")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
