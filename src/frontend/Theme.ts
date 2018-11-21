import * as color from 'color';

interface IColorOptions {
  color?: 'primary' | 'secondary' | 'neutral';
  type?: 'font' | 'background';
  brightness?: 'light' | 'dark' | 'neutral' | 'slightdark';
  transparency?: number;
}

// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=A1887F&secondary.color=9CCC65

const colorPrimary = color('#90caf9');
const colorPrimaryLight = color('#c3fdff');
const colorPrimaryDark = color('#5d99c6');

const colorSecondary = color('#4e342e');
const colorSecondaryLight = color('#7b5e57');
const colorSecondaryDark = color('#260e04');

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
    if (options.color === 'secondary') {
      c = color('white');
    }
    /*
    if (
      (!options.brightness || options.brightness === 'neutral' || options.brightness === 'dark') &&
      options.color === 'primary'
    ) {
      c = color('white');
    }
    */
  }
  if (options.type === 'background') {
    if (options.color === 'primary') {
      if (options.brightness === 'light') {
        c = colorPrimaryLight.hsl();
      } else if (options.brightness === 'dark') {
        c = colorPrimaryDark.hsl();
      } else {
        c = colorPrimary.hsl();
      }
    }
    if (options.color === 'secondary') {
      if (options.brightness === 'light') {
        c = colorSecondaryLight.hsl();
      } else if (options.brightness === 'dark') {
        c = colorSecondaryDark.hsl();
      } else {
        c = colorSecondary.hsl();
      }
    }
    if (options.color === 'neutral') {
      if (options.brightness === 'light') {
        c = colorNeutralLight.hsl();
      } else if (options.brightness === 'slightdark') {
        c = colorNeutralSlightDark.hsl();
      } else if (options.brightness === 'dark') {
        c = colorNeutralDark.hsl();
      } else {
        c = colorNeutral.hsl();
      }
    }
  }
  c = c.alpha(options.transparency);
  return c.string();
};
