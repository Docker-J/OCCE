import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomCard, {
  CardHeader,
  CardBody,
  CardActions,
  CardMedia,
  CardBadge,
  CardContext,
  useCardContext,
} from "./CustomCard";

describe("CustomCard Compound Component", () => {
  describe("Composition & Slots", () => {
    it("renders all compound subcomponents in correct slots", () => {
      render(
        <CustomCard data-testid="custom-card">
          <CustomCard.Media
            src="https://example.com/banner.jpg"
            alt="Banner Image"
            height={200}
            data-testid="card-media"
          />
          <CustomCard.Header
            title="Card Header Title"
            subtitle="Card Header Subtitle"
            action={<button type="button">Header Action</button>}
            avatar={<span data-testid="avatar-slot">Avatar</span>}
            data-testid="card-header"
          />
          <CustomCard.Badge variant="solid" color="#FF6B00" data-testid="card-badge">
            Featured Badge
          </CustomCard.Badge>
          <CustomCard.Body data-testid="card-body">
            <p>Main body content goes here.</p>
          </CustomCard.Body>
          <CustomCard.Actions align="between" data-testid="card-actions">
            <button type="button">Cancel</button>
            <button type="button">Confirm</button>
          </CustomCard.Actions>
        </CustomCard>
      );

      // Card root
      expect(screen.getByTestId("custom-card")).toBeInTheDocument();

      // Media
      const img = screen.getByRole("img", { name: "Banner Image" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/banner.jpg");

      // Header slots
      expect(screen.getByText("Card Header Title")).toBeInTheDocument();
      expect(screen.getByText("Card Header Subtitle")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Header Action" })).toBeInTheDocument();
      expect(screen.getByTestId("avatar-slot")).toBeInTheDocument();

      // Badge
      expect(screen.getByText("Featured Badge")).toBeInTheDocument();

      // Body
      expect(screen.getByText("Main body content goes here.")).toBeInTheDocument();

      // Actions
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });

    it("attaches subcomponents directly to CustomCard function object", () => {
      expect(typeof CustomCard.Header).toBe("function");
      expect(typeof CustomCard.Body).toBe("function");
      expect(typeof CustomCard.Actions).toBe("function");
      expect(typeof CustomCard.Media).toBe("function");
      expect(typeof CustomCard.Badge).toBe("function");
    });

    it("provides named exports identical to attached subcomponents", () => {
      expect(CardHeader).toBe(CustomCard.Header);
      expect(CardBody).toBe(CustomCard.Body);
      expect(CardActions).toBe(CustomCard.Actions);
      expect(CardMedia).toBe(CustomCard.Media);
      expect(CardBadge).toBe(CustomCard.Badge);
    });

    it("renders CustomCard.Header with custom ReactNode title, subtitle, and divider", () => {
      const { container } = render(
        <CustomCard>
          <CustomCard.Header
            title={<h2 data-testid="custom-title">Custom H2 Title</h2>}
            subtitle={<em data-testid="custom-subtitle">Italic Subtitle</em>}
            divider={true}
          />
        </CustomCard>
      );

      expect(screen.getByTestId("custom-title")).toHaveTextContent("Custom H2 Title");
      expect(screen.getByTestId("custom-subtitle")).toHaveTextContent("Italic Subtitle");
      expect(container.querySelector("hr")).toBeInTheDocument();
    });

    it("renders icon when avatar is absent, and favors avatar if both are provided", () => {
      const { rerender } = render(
        <CustomCard>
          <CustomCard.Header
            title="Icon Only"
            icon={<span data-testid="card-icon">ICON</span>}
          />
        </CustomCard>
      );
      expect(screen.getByTestId("card-icon")).toBeInTheDocument();

      rerender(
        <CustomCard>
          <CustomCard.Header
            title="Both Provided"
            icon={<span data-testid="card-icon">ICON</span>}
            avatar={<span data-testid="card-avatar">AVATAR</span>}
          />
        </CustomCard>
      );
      expect(screen.getByTestId("card-avatar")).toBeInTheDocument();
      expect(screen.queryByTestId("card-icon")).not.toBeInTheDocument();
    });

    it("renders CustomCard.Body with noPadding prop", () => {
      const { container: paddedContainer } = render(
        <CustomCard>
          <CustomCard.Body>Padded Content</CustomCard.Body>
        </CustomCard>
      );
      const paddedContent = paddedContainer.querySelector(".MuiCardContent-root");

      const { container: unpaddedContainer } = render(
        <CustomCard>
          <CustomCard.Body noPadding>Unpadded Content</CustomCard.Body>
        </CustomCard>
      );
      const unpaddedContent = unpaddedContainer.querySelector(".MuiCardContent-root");

      expect(paddedContent).toBeInTheDocument();
      expect(unpaddedContent).toBeInTheDocument();
    });

    it("supports all align variants in CustomCard.Actions", () => {
      const alignments = ["left", "right", "center", "between", "space-between"];
      alignments.forEach((align) => {
        const { unmount } = render(
          <CustomCard>
            <CustomCard.Actions align={align} data-testid={`actions-${align}`}>
              <button type="button">Btn</button>
            </CustomCard.Actions>
          </CustomCard>
        );
        expect(screen.getByTestId(`actions-${align}`)).toBeInTheDocument();
        unmount();
      });
    });

    it("renders CustomCard.Badge variants (subtle, solid, outlined)", () => {
      render(
        <CustomCard>
          <CustomCard.Badge variant="solid" color="#10b981" data-testid="badge-solid">
            Solid
          </CustomCard.Badge>
          <CustomCard.Badge variant="outlined" color="#3b82f6" data-testid="badge-outlined">
            Outlined
          </CustomCard.Badge>
          <CustomCard.Badge variant="subtle" color="#f59e0b" data-testid="badge-subtle">
            Subtle
          </CustomCard.Badge>
        </CustomCard>
      );

      expect(screen.getByTestId("badge-solid")).toHaveTextContent("Solid");
      expect(screen.getByTestId("badge-outlined")).toHaveTextContent("Outlined");
      expect(screen.getByTestId("badge-subtle")).toHaveTextContent("Subtle");
    });
  });

  describe("Backward Compatibility Mode (Legacy Flat Props)", () => {
    it("renders legacy title, action, and children wrapped in Body", () => {
      render(
        <CustomCard
          title="Legacy Title"
          action={<button type="button">Legacy Action</button>}
          data-testid="legacy-card"
        >
          <div data-testid="legacy-child">Legacy Child Content</div>
        </CustomCard>
      );

      expect(screen.getByText("Legacy Title")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Legacy Action" })).toBeInTheDocument();
      expect(screen.getByTestId("legacy-child")).toBeInTheDocument();
      // Verifies child was nested into MuiCardContent-root
      expect(screen.getByTestId("legacy-child").closest(".MuiCardContent-root")).toBeInTheDocument();
    });

    it("renders legacy subtitle, avatar, and icon", () => {
      render(
        <CustomCard
          title="Legacy Card"
          subtitle="Legacy Subtitle"
          avatar={<span data-testid="legacy-avatar">AVATAR</span>}
        >
          Body
        </CustomCard>
      );

      expect(screen.getByText("Legacy Card")).toBeInTheDocument();
      expect(screen.getByText("Legacy Subtitle")).toBeInTheDocument();
      expect(screen.getByTestId("legacy-avatar")).toBeInTheDocument();
    });

    it("renders legacy media string as CustomCard.Media", () => {
      const { container } = render(
        <CustomCard
          title="Media Card"
          media="https://example.com/legacy-photo.png"
        >
          Content
        </CustomCard>
      );

      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/legacy-photo.png");
    });

    it("renders legacy actions prop inside Actions slot", () => {
      render(
        <CustomCard
          title="Action Card"
          actions={<button type="button">Save Changes</button>}
        >
          Content
        </CustomCard>
      );

      const actionBtn = screen.getByRole("button", { name: "Save Changes" });
      expect(actionBtn).toBeInTheDocument();
      expect(actionBtn.closest(".MuiCardActions-root")).toBeInTheDocument();
    });

    it("renders legacy body prop when children is not provided", () => {
      render(
        <CustomCard
          title="Body Prop Card"
          body={<span data-testid="explicit-body">Explicit Body Prop</span>}
        />
      );

      expect(screen.getByTestId("explicit-body")).toBeInTheDocument();
    });
  });

  describe("Variants, Interactivity & Context", () => {
    it("handles card click when onClick is provided", () => {
      const handleClick = vi.fn();
      render(
        <CustomCard onClick={handleClick} data-testid="clickable-card">
          <CustomCard.Body>Click Me</CustomCard.Body>
        </CustomCard>
      );

      const card = screen.getByTestId("clickable-card");
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports all design variants (elevated, outlined, flat, gradient)", () => {
      const variants = ["elevated", "outlined", "flat", "gradient"];
      variants.forEach((v) => {
        const { unmount } = render(
          <CustomCard variant={v} data-testid={`card-${v}`}>
            <CustomCard.Body>{v}</CustomCard.Body>
          </CustomCard>
        );
        expect(screen.getByTestId(`card-${v}`)).toBeInTheDocument();
        unmount();
      });
    });

    it("cascades CardContext to consumers via useCardContext", () => {
      let capturedContext = null;
      const ContextConsumer = () => {
        capturedContext = useCardContext();
        return <span>Consumer</span>;
      };

      render(
        <CustomCard variant="flat" interactive={true} themeColor="#00FF00">
          <ContextConsumer />
        </CustomCard>
      );

      expect(capturedContext).toEqual({
        variant: "flat",
        interactive: true,
        themeColor: "#00FF00",
      });
    });
  });

  describe("Adversarial Edge Cases & Stress Scenarios", () => {
    it("handles empty card with no children or props without throwing", () => {
      expect(() => {
        render(<CustomCard data-testid="empty-card" />);
      }).not.toThrow();
      expect(screen.getByTestId("empty-card")).toBeInTheDocument();
    });

    it("handles null, undefined, and false children gracefully", () => {
      render(
        <CustomCard data-testid="falsy-card">
          {null}
          {undefined}
          {false}
          <CustomCard.Body>Valid Child</CustomCard.Body>
        </CustomCard>
      );
      expect(screen.getByText("Valid Child")).toBeInTheDocument();
    });

    it("renders nested CustomCards without context collision", () => {
      let outerContext = null;
      let innerContext = null;

      const OuterConsumer = () => {
        outerContext = useCardContext();
        return null;
      };
      const InnerConsumer = () => {
        innerContext = useCardContext();
        return null;
      };

      render(
        <CustomCard variant="elevated" themeColor="#111111">
          <OuterConsumer />
          <CustomCard.Body>
            <CustomCard variant="outlined" themeColor="#222222">
              <InnerConsumer />
              <CustomCard.Body>Inner Card Body</CustomCard.Body>
            </CustomCard>
          </CustomCard.Body>
        </CustomCard>
      );

      expect(outerContext.variant).toBe("elevated");
      expect(outerContext.themeColor).toBe("#111111");
      expect(innerContext.variant).toBe("outlined");
      expect(innerContext.themeColor).toBe("#222222");
      expect(screen.getByText("Inner Card Body")).toBeInTheDocument();
    });

    it("handles numbers and non-string nodes as titles and subtitles in Header", () => {
      render(
        <CustomCard>
          <CustomCard.Header title={<span>Error 404</span>} subtitle={<span>Status 500</span>} />
        </CustomCard>
      );
      expect(screen.getByText("Error 404")).toBeInTheDocument();
      expect(screen.getByText("Status 500")).toBeInTheDocument();
    });

    it("preserves custom sx and className props through MuiCard", () => {
      const { container } = render(
        <CustomCard className="custom-test-class" sx={{ padding: "42px" }}>
          <CustomCard.Body>Content</CustomCard.Body>
        </CustomCard>
      );
      const card = container.firstChild;
      expect(card).toHaveClass("custom-test-class");
    });
  });
});
