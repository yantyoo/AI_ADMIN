type TopHeaderProps = {
  title: string;
  description: string;
};

export function TopHeader({ title, description }: TopHeaderProps) {
  return (
    <header className="top-header">
      <div>
        <h1 className="top-header__title">{title}</h1>
        {description ? <p className="top-header__description">{description}</p> : null}
      </div>
    </header>
  );
}
