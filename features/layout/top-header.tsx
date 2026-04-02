import { currentUser } from "@/features/layout/config";

type TopHeaderProps = {
  title: string;
  description: string;
};

export function TopHeader({ title, description }: TopHeaderProps) {
  return (
    <header className="top-header">
      <div>
        <h1 className="top-header__title">{title}</h1>
        <p className="top-header__description">{description}</p>
      </div>
      <div className="top-header__user">
        <span className="top-header__user-name">{currentUser.name}</span>
        <span className="top-header__user-role">{currentUser.role}</span>
      </div>
    </header>
  );
}
