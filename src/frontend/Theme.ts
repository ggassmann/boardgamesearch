import * as color from 'color';

interface IColorOptions {
  color?: 'primary' | 'secondary' | 'neutral';
  type?: 'font' | 'background';
  brightness?: 'light' | 'dark' | 'neutral' | 'slightdark';
  transparency?: number;
}

// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=A1887F&secondary.color=9CCC65

const colorPrimary = color('#a1887f');
const colorPrimaryLight = color('#d3b8ae');
const colorPrimaryDark = color('#725b53');

const colorSecondary = color('#9ccc64');
const colorSecondaryLight = color('#cfff94');
const colorSecondaryDark = color('#6b9b36');

const colorNeutral = color('#F5F5F6');
const colorNeutralLight = color('#FFFFFF');
const colorNeutralSlightDark = color('#E5E6E5');
const colorNeutralDark = color('#E1E2E1');

export const getColor = (options: IColorOptions): string => {
  if (options.transparency === undefined) {
    options.transparency = 1;
  }
  let c = color('transparent');
  if (options.type === 'font') {
    c = color('black');
  }
  if (options.type === 'background') {
    if (options.color === 'primary') {
      if (options.brightness === 'light') {
        c = colorPrimaryLight.hsl();
      }
      if (options.brightness === 'dark') {
        c = colorPrimaryDark.hsl();
      }
      c = colorPrimary.hsl();
    }
    if (options.color === 'secondary') {
      if (options.brightness === 'light') {
        c = colorSecondaryLight.hsl();
      }
      if (options.brightness === 'dark') {
        c = colorSecondaryDark.hsl();
      }
      c = colorSecondary.hsl();
    }
    if (options.color === 'neutral') {
      if (options.brightness === 'light') {
        c = colorNeutralLight.hsl();
      }
      if (options.brightness === 'slightdark') {
        c = colorNeutralSlightDark.hsl();
      }
      if (options.brightness === 'dark') {
        c = colorNeutralDark.hsl();
      }
      c = colorNeutral.hsl();
    }
  }
  c = c.alpha(options.transparency);
  return c.string();
};
