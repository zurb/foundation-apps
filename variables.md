# How to write settings variables

Condense the name of the component into one word.

```scss
// Button
$button-background: #000;

// Title bar
$titlebar-background: #000;
```

Only use the hyphen to denote hierarchy, not to separate words. Use this format:

```
$component-subcomponent-property-state
```

For common CSS properties, use these terms:

Variable name | CSS property
------------- | ------------
font-size     | font-size
color         | color
background    | background, background-color
border        | border
shadow        | box-shadow
radius        | border-radius
padding       | padding
margin        | margin
width         | width
height        | height

States should always come last in the variable name. The most common states are hover, active, and focus.

```scss
$button-background-hover: #666;
$button-background-active: #333;
```