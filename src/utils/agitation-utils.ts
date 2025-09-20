import { AgitationMode, AgitationRule, ConditionType } from '../types';

function checkCondition(
  rule: AgitationRule,
  currentMinute: number,
  totalMinutes: number
): boolean {
  const { type, values } = rule.condition;

  switch (type) {
    case 'exact_minutes':
      return values.includes(currentMinute);
    case 'minute_range':
      return currentMinute >= values[0] && currentMinute <= values[1];
    case 'first_minute':
      return currentMinute === 1;
    case 'last_minute':
      return currentMinute === totalMinutes;
    case 'every_n_minutes':
      return currentMinute % values[0] === 0;
    case 'after_minute':
      return currentMinute > values[0];
    case 'default':
      return true;
    default:
      return false;
  }
}

export function getAgitationAction(
  currentMinute: number,
  totalMinutes: number,
  mode: AgitationMode
): AgitationRule | null {
  if (!mode || !mode.rules) {
    return null;
  }

  const matchingRules = mode.rules.filter(rule => 
    checkCondition(rule, currentMinute, totalMinutes)
  );

  if (matchingRules.length === 0) {
    return null;
  }

  // Find the rule with the highest priority
  const highestPriorityRule = matchingRules.reduce((prev, current) => 
    (prev.priority > current.priority) ? prev : current
  );

  return highestPriorityRule;
}
