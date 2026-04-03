"use client";

import type { ReactNode } from "react";

type ListPanelProps = {
  title: ReactNode;
  actions?: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function ListPanel({
  title,
  actions,
  description,
  toolbar,
  footer,
  className,
  children
}: ListPanelProps) {
  return (
    <section className={`list-panel${className ? ` ${className}` : ""}`}>
      <div className="list-panel__header">
        <div className="list-panel__heading">
          <h2 className="list-panel__title">{title}</h2>
          {description ? <p className="list-panel__description">{description}</p> : null}
        </div>
        {actions ? <div className="list-panel__actions">{actions}</div> : null}
      </div>

      {toolbar ? <div className="list-panel__toolbar">{toolbar}</div> : null}

      <div className="list-panel__body">{children}</div>

      {footer ? <div className="list-panel__footer">{footer}</div> : null}
    </section>
  );
}
