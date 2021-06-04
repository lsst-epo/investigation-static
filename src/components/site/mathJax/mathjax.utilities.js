import { renderUnit } from '../../charts/shared/unit/utilities.js';
import { primary } from '../../../assets/stylesheets/_variables.scss';

export function colorize(value, color) {
  return `\\textcolor{${color || primary}}{${value}}`;
}

export function addColorAndUnit(value, unit) {
  return `${colorize(value)} \\ \\mathrm{${renderUnit(unit)}}`;
}
