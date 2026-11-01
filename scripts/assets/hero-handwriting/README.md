# Hero pen lettering

The homepage phrase is drawn with actual pen centre-lines from EMS Allure,
a single-stroke derivative of Allura. It is not the outline of a filled font.

- SVG stroke conversion: Sheldon B. Michaels and Windell H. Oskay.
- Original Allura design: Rob Leuschke / TypeSETit.
- Original copyright: Copyright 2010 The Allura Project Authors
  (https://github.com/googlefonts/allura).
- Stroke font source: https://gitlab.com/oskay/svg-fonts/-/blob/master/fonts/EMS/EMSAllure.svg
- Font collection: https://gitlab.com/oskay/svg-fonts
- License: SIL Open Font License 1.1, included in
  `src/assets/handwriting/hero-pen-OFL.txt`.

The original font is retained here for reproducibility and is not shipped as a
web font. Run `python scripts/generate-hero-handwriting.py` to generate the
headline's SVG paths. The generator rounds the digitized traces, keeps separate
pen lifts, and measures each stroke so drawing and reverse erasing have the same
constant pen speed. Only the generated headline geometry enters the browser bundle.
