export type PlaceholderSpec = {
  title: string;
  description: string;
  blockedReason: string;
};

export function getPlaceholderSpec(title: string, description: string): PlaceholderSpec {
  return {
    title,
    description,
    blockedReason: "기능정의서에 상세 화면/액션/API가 없어 구현을 보류했습니다."
  };
}
