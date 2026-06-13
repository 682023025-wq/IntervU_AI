# 📘 Design System - IntervU AI

**Version:** 1.0.0  
**Last Updated:** 2026  
**Status:** Final

---

## 🎨 1. Design Tokens

### 1.1 Color Palette

#### Primary Colors
```css
/* Deep Navy - Primary Brand Color */
--color-primary-900: #0F4C75;    /* Navbar, Headers, Primary Buttons */
--color-primary-800: #1B5F8C;    /* Hover states */
--color-primary-700: #2872A3;    /* Active states */

/* Sky Blue - Secondary Brand Color */
--color-secondary-100: #BBE1FA;  /* Page Background, AI Chat Bubbles */
--color-secondary-200: #9FD3F7;  /* Hover states */
--color-secondary-300: #83C5F4;  /* Active states */

/* Pure White */
--color-white: #FFFFFF;          /* Cards, Inputs, Modal Backgrounds */
--color-gray-50: #F8F9FA;        /* Alternative Background */
```

#### Semantic Colors
```css
/* Success States */
--color-success-500: #28A745;    /* Completed status, High scores (>80) */
--color-success-100: #D4EDDA;    /* Success backgrounds */

/* Warning States */
--color-warning-500: #FFC107;    /* Ongoing status, Medium scores (60-79) */
--color-warning-100: #FFF3CD;    /* Warning backgrounds */

/* Error States */
--color-error-500: #DC3545;      /* Abandoned status, Low scores (<60) */
--color-error-100: #F8D7DA;      /* Error backgrounds */

/* Neutral Colors */
--color-text-primary: #333333;   /* Primary text */
--color-text-secondary: #6C757D; /* Secondary text, captions */
--color-border: #DEE2E6;         /* Borders, dividers */
--color-shadow: rgba(15, 76, 117, 0.1);
```

#### AI Provider Colors
```css
--color-gemini: #4285F4;         /* Google Gemini Brand Color */
--color-groq: #10B981;           /* Groq Brand Color (Emerald) */
--color-ai-fallback: #FF9800;    /* Orange for fallback indicator */
```

### 1.2 Typography

#### Font Families
```css
/* Primary Font */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Alternative for Accessibility */
--font-dyslexic: 'OpenDyslexic', var(--font-primary);
```

#### Font Sizes
```css
/* Base Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Heading Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 1.3 Spacing System

```css
/* Base unit: 4px */
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### 1.4 Border Radius

```css
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Circular */
```

### 1.5 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(15, 76, 117, 0.1), 0 2px 4px -1px rgba(15, 76, 117, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(15, 76, 117, 0.1), 0 4px 6px -2px rgba(15, 76, 117, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(15, 76, 117, 0.1), 0 10px 10px -5px rgba(15, 76, 117, 0.04);

/* Hover elevation */
--shadow-hover: 0 10px 15px -3px rgba(15, 76, 117, 0.15);
```

### 1.6 Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;    /* Small devices (landscape phones) */
--breakpoint-md: 768px;    /* Medium devices (tablets) */
--breakpoint-lg: 1024px;   /* Large devices (desktops) */
--breakpoint-xl: 1280px;   /* Extra large devices (large desktops) */
--breakpoint-2xl: 1536px;  /* 2X large devices */
```

### 1.7 Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Common transitions */
--transition-colors: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
--transition-transform: transform var(--transition-base);
--transition-shadow: box-shadow var(--transition-base);
```

---

## 🧩 2. Component Library

### 2.1 Navigation Components

#### Desktop Top Navbar
```css
/* Container */
.navbar-desktop {
  height: 72px;
  background-color: var(--color-primary-900);
  box-shadow: var(--shadow-md);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Logo Section */
.navbar-logo {
  color: var(--color-white);
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* Navigation Links */
.navbar-link {
  color: var(--color-white);
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: var(--transition-colors);
}

.navbar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  border-bottom: 3px solid var(--color-secondary-300);
}

/* User Avatar */
.navbar-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-white);
  object-fit: cover;
}
```

#### Mobile Bottom Navigation
```css
/* Container */
.navbar-mobile {
  height: 64px;
  background-color: var(--color-white);
  box-shadow: 0 -4px 6px -1px var(--color-shadow);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* Navigation Item */
.navbar-mobile-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2);
  min-height: 44px; /* Touch target */
  color: var(--color-text-secondary);
  transition: var(--transition-colors);
}

.navbar-mobile-item.active {
  color: var(--color-primary-900);
}

.navbar-mobile-item.active .icon {
  transform: scale(1.1);
}

/* Icon */
.navbar-mobile-item .icon {
  width: 24px;
  height: 24px;
  transition: var(--transition-transform);
}

/* Label */
.navbar-mobile-item .label {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
}
```

### 2.2 Button Components

#### Primary Button
```css
.btn-primary {
  background-color: var(--color-primary-900);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
  min-height: 44px; /* Touch target */
}

.btn-primary:hover {
  background-color: var(--color-primary-800);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: var(--color-secondary-200);
  cursor: not-allowed;
  transform: none;
}

/* Sizes */
.btn-primary-sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-sm);
  min-height: 36px;
}

.btn-primary-lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--text-lg);
  min-height: 52px;
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: var(--color-white);
  color: var(--color-primary-900);
  border: 2px solid var(--color-primary-900);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
  min-height: 44px;
}

.btn-secondary:hover {
  background-color: var(--color-secondary-100);
}
```

#### AI Provider Badge Button
```css
.btn-ai-provider {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.btn-ai-provider.gemini {
  background-color: var(--color-gemini);
  color: var(--color-white);
}

.btn-ai-provider.groq {
  background-color: var(--color-groq);
  color: var(--color-white);
}

.btn-ai-provider.fallback {
  background-color: var(--color-ai-fallback);
  color: var(--color-white);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### 2.3 Card Components

#### Base Card
```css
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
  transition: var(--transition-shadow);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-900);
  margin: 0;
}

/* Card Body */
.card-body {
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
}
```

#### Dashboard Widget Card
```css
.widget-card {
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
  color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-lg);
}

.widget-value {
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  margin: var(--spacing-2) 0;
}

.widget-label {
  font-size: var(--text-sm);
  opacity: 0.9;
}

.widget-trend {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-3);
}

.widget-trend.positive {
  color: #86EFAC; /* Light green */
}

.widget-trend.negative {
  color: #FCA5A5; /* Light red */
}
```

#### Interview Session Card
```css
.session-card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  border: 2px solid var(--color-border);
  transition: var(--transition-base);
}

.session-card:hover {
  border-color: var(--color-primary-700);
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.session-status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
}

.session-status.berlangsung {
  background-color: var(--color-warning-100);
  color: #B45309; /* Dark amber */
}

.session-status.selesai {
  background-color: var(--color-success-100);
  color: #047857; /* Dark green */
}

.session-status.ditinggalkan {
  background-color: var(--color-error-100);
  color: #B91C1C; /* Dark red */
}

.session-score {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-900);
}

.session-score.high {
  color: var(--color-success-500);
}

.session-score.medium {
  color: var(--color-warning-500);
}

.session-score.low {
  color: var(--color-error-500);
}
```

### 2.4 Form Components

#### Input Field
```css
.input-field {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  transition: var(--transition-base);
  background-color: var(--color-white);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary-700);
  box-shadow: 0 0 0 3px rgba(187, 225, 250, 0.5);
}

.input-field:disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
}

.input-field.error {
  border-color: var(--color-error-500);
}

.input-field.success {
  border-color: var(--color-success-500);
}

/* Label */
.input-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.input-label.required::after {
  content: " *";
  color: var(--color-error-500);
}

/* Helper Text */
.input-helper {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-1);
}

.input-error {
  color: var(--color-error-500);
}
```

#### Textarea
```css
.textarea-field {
  min-height: 120px;
  resize: vertical;
  line-height: var(--leading-relaxed);
}

.textarea-field.character-limit {
  position: relative;
}

.character-counter {
  position: absolute;
  bottom: var(--spacing-3);
  right: var(--spacing-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
```

#### Tag Input
```css
.tag-input-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  min-height: 44px;
  align-items: center;
}

.tag-input-container:focus-within {
  border-color: var(--color-primary-700);
  box-shadow: 0 0 0 3px rgba(187, 225, 250, 0.5);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background-color: var(--color-secondary-100);
  color: var(--color-primary-900);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.tag-remove {
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.tag-remove:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--color-error-500);
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: var(--spacing-1);
  font-size: var(--text-base);
}
```

### 2.5 Chat & Interview Components

#### Chat Container
```css
.chat-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
  background-color: var(--color-secondary-100);
  border-radius: var(--radius-xl);
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

/* AI Message (Pewawancara) */
.chat-message.ai {
  align-self: flex-start;
  max-width: 70%;
  background-color: var(--color-white);
  padding: var(--spacing-4);
  border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-primary-900);
}

.chat-message.ai .message-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.chat-message.ai .avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-900);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
}

.chat-message.ai .message-content {
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
}

/* User Message (Kandidat) */
.chat-message.user {
  align-self: flex-end;
  max-width: 70%;
  background-color: var(--color-primary-900);
  padding: var(--spacing-4);
  border-radius: var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.chat-message.user .message-content {
  color: var(--color-white);
  line-height: var(--leading-normal);
}

/* Recording Indicator */
.recording-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--color-error-500);
  font-weight: var(--font-weight-semibold);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.recording-dot {
  width: 12px;
  height: 12px;
  background-color: var(--color-error-500);
  border-radius: var(--radius-full);
}
```

#### Video Interview Container
```css
.video-interview-container {
  position: relative;
  background-color: var(--color-gray-50);
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 16/9;
}

.video-user {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* Non-verbal Metrics Overlay */
.metrics-overlay {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  background-color: rgba(255, 255, 255, 0.95);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.metric-item:last-child {
  margin-bottom: 0;
}

.metric-label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.metric-value {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
}

.metric-value.good {
  color: var(--color-success-500);
}

.metric-value.warning {
  color: var(--color-warning-500);
}

.metric-value.bad {
  color: var(--color-error-500);
}

/* Progress Bar for Metrics */
.metric-progress {
  width: 100%;
  height: 6px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--spacing-1);
}

.metric-progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.metric-progress-fill.good {
  background-color: var(--color-success-500);
}

.metric-progress-fill.warning {
  background-color: var(--color-warning-500);
}

.metric-progress-fill.bad {
  background-color: var(--color-error-500);
}
```

#### Interview Controls
```css
.interview-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.control-button {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
}

.control-button.primary {
  background-color: var(--color-error-500);
  color: var(--color-white);
  width: 64px;
  height: 64px;
}

.control-button.primary:hover {
  background-color: #B91C1C;
  transform: scale(1.05);
}

.control-button.secondary {
  background-color: var(--color-secondary-100);
  color: var(--color-primary-900);
}

.control-button.secondary:hover {
  background-color: var(--color-secondary-200);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 2.6 Progress & Feedback Components

#### Progress Bar
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.progress-bar-fill.success {
  background: linear-gradient(90deg, var(--color-success-500) 0%, #34D399 100%);
}

.progress-bar-fill.warning {
  background: linear-gradient(90deg, var(--color-warning-500) 0%, #FBBF24 100%);
}

.progress-bar-fill.error {
  background: linear-gradient(90deg, var(--color-error-500) 0%, #F87171 100%);
}
```

#### Score Circle
```css
.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
}

.score-circle svg {
  transform: rotate(-90deg);
}

.score-circle-bg {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 8;
}

.score-circle-progress {
  fill: none;
  stroke: var(--color-primary-900);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset var(--transition-slow);
}

.score-circle-progress.high {
  stroke: var(--color-success-500);
}

.score-circle-progress.medium {
  stroke: var(--color-warning-500);
}

.score-circle-progress.low {
  stroke: var(--color-error-500);
}

.score-circle-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-900);
}
```

#### Toast Notification
```css
.toast-container {
  position: fixed;
  top: var(--spacing-6);
  right: var(--spacing-6);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.toast {
  min-width: 320px;
  max-width: 480px;
  padding: var(--spacing-4) var(--spacing-5);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  animation: slideIn var(--transition-base);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.success {
  background-color: var(--color-success-100);
  border-left: 4px solid var(--color-success-500);
}

.toast.warning {
  background-color: var(--color-warning-100);
  border-left: 4px solid var(--color-warning-500);
}

.toast.error {
  background-color: var(--color-error-100);
  border-left: 4px solid var(--color-error-500);
}

.toast.info {
  background-color: var(--color-secondary-100);
  border-left: 4px solid var(--color-primary-900);
}

.toast-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.toast-message {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
```

### 2.7 Badge & Status Components

#### Status Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

.badge.berlangsung {
  background-color: var(--color-warning-100);
  color: #92400E;
}

.badge.berlangsung .badge-dot {
  background-color: var(--color-warning-500);
  animation: pulse 2s infinite;
}

.badge.selesai {
  background-color: var(--color-success-100);
  color: #047857;
}

.badge.selesai .badge-dot {
  background-color: var(--color-success-500);
}

.badge.ditinggalkan {
  background-color: var(--color-error-100);
  color: #B91C1C;
}

.badge.ditinggalkan .badge-dot {
  background-color: var(--color-error-500);
}
```

#### AI Provider Badge
```css
.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
}

.ai-badge.gemini {
  background-color: rgba(66, 133, 244, 0.1);
  color: var(--color-gemini);
  border: 1px solid var(--color-gemini);
}

.ai-badge.groq {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-groq);
  border: 1px solid var(--color-groq);
}

.ai-badge.fallback {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--color-ai-fallback);
  border: 1px solid var(--color-ai-fallback);
}
```

---

## 📐 3. Layout System

### 3.1 Page Layouts

#### Desktop Layout (≥1024px)
```css
.page-layout-desktop {
  padding-top: 72px; /* Navbar height */
  min-height: 100vh;
  background-color: var(--color-secondary-100);
}

.page-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--spacing-8);
}

/* Grid System */
.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Responsive Grid */
@media (min-width: 640px) {
  .grid-cols-sm-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .grid-cols-lg-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-lg-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

#### Mobile Layout (<768px)
```css
.page-layout-mobile {
  padding-bottom: 64px; /* Bottom nav height */
  min-height: 100vh;
  background-color: var(--color-secondary-100);
}

.page-content-mobile {
  padding: var(--spacing-4);
}

/* Single Column Layout */
.mobile-card-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* Full Width Elements */
.mobile-full-width {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}
```

### 3.2 Dashboard Layout
```css
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 1024px) {
  .dashboard-container {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .dashboard-widget-full {
    grid-column: span 3;
  }
  
  .dashboard-widget-wide {
    grid-column: span 2;
  }
  
  .dashboard-widget-narrow {
    grid-column: span 1;
  }
}

/* Widget Sections */
.dashboard-section {
  margin-bottom: var(--spacing-8);
}

.dashboard-section-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-900);
  margin-bottom: var(--spacing-4);
}
```

### 3.3 Interview Layout
```css
.interview-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
  height: calc(100vh - 72px - var(--spacing-8));
}

@media (min-width: 1024px) {
  .interview-layout {
    grid-template-columns: 1fr 350px;
  }
  
  .interview-main {
    grid-column: 1;
  }
  
  .interview-sidebar {
    grid-column: 2;
  }
}

.interview-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.interview-sidebar {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  overflow-y: auto;
}
```

---

## 📱 4. Responsive Behavior

### 4.1 Breakpoint Usage

```css
/* Mobile First - Default styles for mobile */
.component {
  /* Mobile styles */
  padding: var(--spacing-4);
  font-size: var(--text-base);
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-8);
    font-size: var(--text-lg);
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 4.2 Touch Targets
```css
/* All interactive elements must have minimum 44x44px touch target */
.btn,
.input-field,
.select-field,
.navbar-mobile-item,
.card-action {
  min-height: 44px;
  min-width: 44px;
}

/* For smaller elements, add padding */
.icon-button-small {
  padding: var(--spacing-2);
  min-height: 44px;
  min-width: 44px;
}
```

### 4.3 Hide/Show by Breakpoint
```css
/* Hide on mobile, show on desktop */
.hidden-mobile {
  display: none;
}

@media (min-width: 1024px) {
  .hidden-mobile {
    display: block;
  }
}

/* Show on mobile, hide on desktop */
.hidden-desktop {
  display: block;
}

@media (min-width: 1024px) {
  .hidden-desktop {
    display: none;
  }
}
```

---

## 🎭 5. Animations & Transitions

### 5.1 Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn var(--transition-base);
}

/* Slide Up */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp var(--transition-base);
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scaleIn var(--transition-base);
}

/* Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
```

### 5.2 Loading States
```css
/* Skeleton Loader */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border) 0%,
    var(--color-secondary-200) 50%,
    var(--color-border) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 16px;
  margin-bottom: var(--spacing-2);
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: var(--spacing-4);
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
}

.skeleton-card {
  height: 200px;
  border-radius: var(--radius-xl);
}
```

---

## 🌓 6. Dark Mode (Optional)

### 6.1 Dark Mode Tokens
```css
/* Default: Light Mode */
:root {
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-secondary-100);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --border-color: var(--color-border);
}

/* Dark Mode */
[data-theme="dark"] {
  --bg-primary: #1E293B;
  --bg-secondary: #0F172A;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --border-color: #334155;
  
  /* Adjust primary colors for dark mode */
  --color-primary-900: #60A5FA; /* Lighter blue */
  --color-secondary-100: #1E3A5F; /* Darker sky blue */
}

/* Apply dark mode */
[data-theme="dark"] body {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

[data-theme="dark"] .card {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
}

[data-theme="dark"] .input-field {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}
```

---

## ♿ 7. Accessibility Guidelines

### 7.1 Focus States
```css
/* Visible focus indicator for keyboard navigation */
*:focus {
  outline: 2px solid var(--color-primary-700);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-primary-700);
  outline-offset: 2px;
}

/* Enhanced focus for interactive elements */
.btn:focus-visible,
.input-field:focus-visible,
.card-action:focus-visible {
  box-shadow: 0 0 0 3px rgba(187, 225, 250, 0.8), var(--shadow-md);
}
```

### 7.2 Color Contrast
```css
/* Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text) */
.text-primary {
  color: var(--color-text-primary); /* #333333 on #FFFFFF = 12.6:1 ✓ */
}

.text-on-primary {
  color: var(--color-white); /* #FFFFFF on #0F4C75 = 8.5:1 ✓ */
}

.text-secondary {
  color: var(--color-text-secondary); /* #6C757D on #FFFFFF = 5.3:1 ✓ */
}

/* Warning text on light background */
.text-warning {
  color: #B45309; /* Dark amber on white = 4.7:1 ✓ */
}

/* Error text on light background */
.text-error {
  color: #B91C1C; /* Dark red on white = 5.2:1 ✓ */
}
```

### 7.3 Screen Reader Only
```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-900);
  color: var(--color-white);
  padding: var(--spacing-2) var(--spacing-4);
  z-index: 10000;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 0;
}
```

---

## 📝 8. Usage Guidelines

### 8.1 DO's
✅ **DO** use the design tokens (CSS variables) instead of hardcoding values  
✅ **DO** maintain minimum 44x44px touch targets for mobile  
✅ **DO** ensure color contrast meets WCAG AA standards  
✅ **DO** use semantic HTML elements  
✅ **DO** provide alt text for images  
✅ **DO** test with keyboard navigation  
✅ **DO** use the breakpoint system for responsive design  
✅ **DO** maintain consistent spacing using the spacing scale  

### 8.2 DON'Ts
❌ **DON'T** use hardcoded colors - always use CSS variables  
❌ **DON'T** create custom animations that conflict with the design system  
❌ **DON'T** ignore mobile-first approach  
❌ **DON'T** use font sizes smaller than 12px  
❌ **DON'T** remove focus indicators  
❌ **DON'T** use more than 3 colors in a single component  
❌ **DON'T** ignore loading states  
❌ **DON'T** forget error states for forms  

---

## 🔄 9. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026 | Initial release - Complete design system | Design Team |

---

## 📎 10. Resources

### 10.1 Design Files
- Figma: [Link to Figma file]
- Adobe XD: [Link to XD file]

### 10.2 Code Repositories
- Frontend: [GitHub repository]
- Component Library: [Storybook/NPM package]

### 10.3 Tools
- Color Contrast Checker: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/ )
- Accessibility Testing: [axe DevTools](https://www.deque.com/axe/devtools/ )
- Responsive Testing: [Responsively App](https://responsively.app/ )

---

**📌 This design system is the single source of truth for IntervU AI. All designs must adhere to these guidelines to maintain consistency.**

**Last Reviewed:** 2026  
**Next Review:** Q4 2026
