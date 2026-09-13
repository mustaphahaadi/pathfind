import {
  mentorFilterOptions,
  useMentorFilterStore,
} from "../../store/useMentorFilterStore";

const MentorFilterTabs = () => {
  const activeFilter = useMentorFilterStore((state) => state.activeFilter);
  const setFilter = useMentorFilterStore((state) => state.setFilter);

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Filter mentors by category"
    >
      {mentorFilterOptions.map((option) => {
        const isActive = option === activeFilter;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setFilter(option)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-ink text-white"
                : "bg-transparent text-muted hover:bg-cream-dark"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default MentorFilterTabs;
