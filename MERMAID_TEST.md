# Mermaid Diagram Test

## Test 1: Simple Architecture Flow

```mermaid
graph LR
    A[🎨 Figma Design] --> B[🐍 Python Pipeline]
    C[🎨 UPS Brand CSS] --> B
    B --> D[🤖 IBM Granite AI]
    D --> E[✅ Validation]
    E --> F[⚡ Angular Component]
    F --> G[🌐 Browser Preview]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
    style B fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff9c4
    style F fill:#ffccbc
    style G fill:#c5e1a5
```

## Test 2: 12-Step Pipeline

```mermaid
flowchart TD
    START([Start]) --> S1[1. Validate Inputs]
    S1 --> S2[2. Extract Figma Data]
    S2 --> S3[3. Brand Preprocessing]
    S3 --> S4[4. Prompt Engineering]
    S4 --> S5[5. IBM Granite AI]
    S5 --> S6[6. Parse Response]
    S6 --> S7[7. Auto-fix TypeScript]
    S7 --> S8[8. CSS Validation]
    S8 --> S9[9. Generate Files]
    S9 --> S10[10. Git Automation]
    S10 --> S11[11. Browser Preview]
    S11 --> S12[12. Developer Approval]
    
    S12 -->|Accept| END([Production Ready])
    S12 -->|Reject| S4
    S12 -->|Regenerate| S5
    
    style S1 fill:#e1f5fe
    style S5 fill:#f3e5f5
    style S8 fill:#e8f5e8
    style S12 fill:#fff3e0
    style END fill:#c8e6c9
```

## Test 3: Technology Stack

```mermaid
graph TD
    FIGMA[Figma API] --> PYTHON
    IBM[IBM Granite] --> PYTHON
    BRAND[UPS Brand] --> PYTHON
    
    PYTHON[Python Pipeline] --> ANGULAR
    PYTHON --> GIT
    PYTHON --> BROWSER
    
    ANGULAR[Angular 20.3.0] --> OUTPUT[Component Files]
    GIT[Git Automation] --> OUTPUT
    BROWSER[Browser Preview] --> OUTPUT
    
    style FIGMA fill:#9c27b0
    style IBM fill:#1976d2
    style PYTHON fill:#ff9800
    style BRAND fill:#795548
    style ANGULAR fill:#dd2c00
    style GIT fill:#4caf50
    style BROWSER fill:#2196f3
    style OUTPUT fill:#ffc107
```

## Test 4: Simple System Architecture

```mermaid
graph TB
    subgraph INPUT[INPUT LAYER]
        FIGMA_IN[Figma Design Data]
        BRAND_IN[UPS Brand System]
    end
    
    subgraph PIPELINE[PROCESSING LAYER]
        PYTHON_P[Python Orchestrator]
        PROMPT_P[Prompt Engineering]
        AI_P[IBM Granite LLM]
    end
    
    subgraph VALIDATE[VALIDATION LAYER]
        AUTOFIX_V[TypeScript Auto-fix]
        CSSCHECK_V[CSS Brand Check]
    end
    
    subgraph OUTPUT[OUTPUT LAYER]
        FILES_O[File Generation]
        GIT_O[Git Automation]
        PREVIEW_O[Browser Preview]
    end
    
    FIGMA_IN --> PYTHON_P
    BRAND_IN --> PYTHON_P
    PYTHON_P --> PROMPT_P
    PROMPT_P --> AI_P
    AI_P --> AUTOFIX_V
    AUTOFIX_V --> CSSCHECK_V
    CSSCHECK_V --> FILES_O
    FILES_O --> GIT_O
    FILES_O --> PREVIEW_O
    
    style INPUT fill:#e3f2fd
    style PIPELINE fill:#f3e5f5
    style VALIDATE fill:#e8f5e8
    style OUTPUT fill:#fff3e0
```

---

✅ All diagrams should render properly in GitHub!
