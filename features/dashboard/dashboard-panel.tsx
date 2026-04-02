"use client";

import { useState } from "react";
import { dashboardMockByRange } from "@/api/dashboard";
import type { DashboardPayload, TimeRange } from "@/types/dashboard";
import { dashboardRangeLabels } from "@/features/dashboard/range-config";
import { ErrorState } from "@/features/dashboard/error-state";
import { FeedbackRatio } from "@/features/dashboard/feedback-ratio";
import { KeywordList } from "@/features/dashboard/keyword-list";
import { MetricCard } from "@/features/dashboard/metric-card";
import { TimeRangeTabs } from "@/features/dashboard/time-range-tabs";
import { TrendChart } from "@/features/dashboard/trend-chart";
import { DonutChart } from "@/features/dashboard/donut-chart";

type DashboardPanelProps = {
  data: DashboardPayload;
};

export function DashboardPanel({ data }: DashboardPanelProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(data.selectedRange);
  const [showError, setShowError] = useState(false);
  const selectedData = dashboardMockByRange[selectedRange];

  const selectedLabel = dashboardRangeLabels[selectedRange];

  return (
    <div className="dashboard-grid">
      <section className="panel panel--main">
        <div className="panel__header">
          <div>
            <h2 className="panel__title">기간별 문의 현황</h2>
            <p className="panel__caption">선택 기간 기준 문의 추이를 선형 차트로 제공합니다.</p>
          </div>
          <div className="panel__actions">
            <span className="panel__range-label">{selectedLabel.helper}</span>
            <TimeRangeTabs value={selectedRange} onChange={setSelectedRange} />
          </div>
        </div>

        {showError ? (
          <ErrorState onRetry={() => setShowError(false)} />
        ) : (
          <>
            <div className="metric-card-grid">
              {selectedData.metrics.map((metric) => (
                <MetricCard key={metric.key} metric={metric} />
              ))}
              <button
                type="button"
                className="metric-card metric-card--ghost"
                onClick={() => setShowError(true)}
              >
                <div className="metric-card__label">조회 실패 상태</div>
                <div className="metric-card__value metric-card__value--alert">테스트</div>
                <div className="metric-card__policy">
                  데이터 불러오기 실패 상태와 재시도 버튼을 확인합니다.
                </div>
              </button>
            </div>

            <TrendChart points={selectedData.trend} rangeLabel={selectedLabel.axisLabel} />
          </>
        )}
      </section>

      <section className="dashboard-side">
        <KeywordList items={selectedData.topKeywords} />
        <FeedbackRatio data={selectedData.feedbackRatio} />
        <DonutChart data={selectedData.knowledgeResponse} />
      </section>
    </div>
  );
}
