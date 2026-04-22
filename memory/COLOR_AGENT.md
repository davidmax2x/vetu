# Color Agent Memory
## Role
12-season color palette engine, cultural variants, style recommendations,
hex swatch components.
## Status: NOT STARTED
## Files I Own
- `lib/colorPalettes.js`
- `lib/styleRecommendations.js`
- `lib/culturalContext.js`
- `components/ColorPalette.jsx`
- `components/ColorSwatch.jsx`
- `__tests__/colorPalettes.test.js`
## Palette Contract
Each palette: { best[], neutral[], avoid[], names{}, metallic, description, culturalVariants{} }

**culturalVariants minimum data requirement (enforced by CP1 script):**
Each cultural variant array must contain at least 6 hex values that are:
- Distinct from the base best[] array (genuine additions, not copies)
- Appropriate for occasion wear in that cultural context
- Validated by at least one external reference (note the source in a comment)

Sources to use:
- south-asian: Indian bridal colour theory, Pantone fashion reports for South Asia
- west-african: Kente cloth colour traditions, Nigerian aso-ebi palette conventions
- east-asian: Chinese auspicious colour theory, Korean hansbok palette traditions

**If culturalVariants cannot be populated with genuine data for a season,
set the array to [] and add a note — do not invent values.**
The `/for-every-complexion` page must only claim what the data supports.
## Completed Work
_None_
## Decisions Made
_None_
## Known Issues
_None_
## Final Report
_Pending_
