import { useLanguage } from "../context/LanguageContext.jsx";

export const useTranslatedStatuses = () => {
  const { t } = useLanguage();

  const projectStatuses = {
    completed: { label: t("completed"), color: "#111111" },
    active: { label: t("active"), color: "#555555" },
    "in-hold": { label: t("inHold"), color: "#AAAAAA" },
  };

  const teamAvailability = {
    available: { label: t("available"), color: "#111111" },
    remote: { label: t("remote"), color: "#777777" },
    "on leave": { label: t("onLeave"), color: "#BBBBBB" },
  };

  return { projectStatuses, teamAvailability };
};

// Keep static exports for non-component usage
export const projectStatuses = {
  completed: { label: "Completed", color: "#111111" },
  active: { label: "Active", color: "#555555" },
  "in-hold": { label: "In Hold", color: "#AAAAAA" },
};

export const teamAvailability = {
  available: { label: "Available", color: "#111111" },
  remote: { label: "Remote", color: "#777777" },
  "on leave": { label: "On Leave", color: "#BBBBBB" },
};
