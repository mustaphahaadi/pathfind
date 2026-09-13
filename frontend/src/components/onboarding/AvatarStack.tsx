interface AvatarStackProps {
  avatarUrls: string[];
  overflowCount?: number;
}

const AvatarStack = ({ avatarUrls, overflowCount }: AvatarStackProps) => {
  return (
    <div className="flex -space-x-2">
      {avatarUrls.map((url) => (
        <img
          key={url}
          src={url}
          alt=""
          className="h-9 w-9 rounded-full border-2 border-white object-cover"
        />
      ))}
      {overflowCount ? (
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-surface text-xs font-semibold text-ink">
          +{overflowCount}
        </span>
      ) : null}
    </div>
  );
};

export default AvatarStack;
