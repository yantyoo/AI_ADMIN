import type { KeywordItem } from "@/types/dashboard";

type KeywordListProps = {
  items: KeywordItem[];
};

export function KeywordList({ items }: KeywordListProps) {
  return (
    <section className="panel panel--side">
      <div className="panel__header panel__header--compact">
        <h2 className="panel__title">자주 묻는 질문 키워드</h2>
        <span className="panel__range-label">오늘 기준 7일</span>
      </div>

      <ol className="keyword-list">
        {items.map((item) => (
          <li key={item.rank} className="keyword-list__item">
            <div className="keyword-list__left">
              <span className="keyword-list__rank">{item.rank}</span>
              <span className="keyword-list__label">{item.label}</span>
            </div>
            <strong className="keyword-list__count">{item.count.toLocaleString()}건</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}
