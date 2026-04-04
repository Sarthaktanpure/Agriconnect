import React from "react";

const FeedbackState = ({ icon: Icon, title, description, actions = [], tone = "default" }) => {
  const toneStyles = {
    default: {
      wrapper: "border-gray-100 shadow-green-950/5",
      icon: "bg-gray-50 text-gray-500",
    },
    error: {
      wrapper: "border-red-100 shadow-red-950/5",
      icon: "bg-red-50 text-red-600",
    },
    success: {
      wrapper: "border-green-100 shadow-green-950/5",
      icon: "bg-green-50 text-green-700",
    },
  };

  const styles = toneStyles[tone] || toneStyles.default;

  return (
    <div className={`rounded-[2rem] border bg-white p-10 text-center shadow-xl ${styles.wrapper}`}>
      {Icon ? (
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${styles.icon}`}>
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="mt-6 text-2xl font-black text-gray-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-gray-500">{description}</p>
      {actions.length ? (
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {actions.map((action) => action)}
        </div>
      ) : null}
    </div>
  );
};

export default FeedbackState;
