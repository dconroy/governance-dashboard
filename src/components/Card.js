import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import descend from "../imgs/descend.svg";
import { toSlug } from "../utils/misc";
import { colors, fonts, shadows, transitions, responsive } from "../styles";

const StyledCard = styled.div`
  transition: ${transitions.base};
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "none")};
  border: none;
  border-style: none;
  border-radius: 4px;
  display: block;
  color: rgb(${colors.black});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  box-shadow: ${shadows.soft};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  flex-direction: column;
  margin: 0 auto;
  text-align: left;
  overflow: hidden;
`;

const CardElement = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
  transition: ${transitions.base};
  position: relative;
  width: 100%;
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  max-height: auto;
  border-top: solid 2px #eaeaea;
  color: rgb(${colors.dark});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 0 auto;
  text-align: left;
  overflow: hidden;
  @media screen and (${responsive.sm.max}) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Card = ({ background, children, ...props }) => (
  <StyledCard background={background} {...props}>
    {children}
  </StyledCard>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string,
  minHeight: PropTypes.number
};

Card.defaultProps = {
  background: "white",
  minHeight: null
};

const CardTopWrapper = styled.div`
  transition: ${transitions.base};
  position: relative;
  padding: 23px 24px;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "none")};
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  border-style: none;
  border: none;
  color: rgb(${colors.dark});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 0 auto;
  text-align: left;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  & ~ div {
    ${({ collapse }) =>
      collapse
        ? css`
            max-height: 0;
          `
        : css`
            max-height: 600px;
          `};
  }
`;

const TopicStatus = styled.div`
  line-height: 24px;
  align-self: center;
  background-color: ${({ active }) => (active ? "#d2f9f1" : "#EAEFF7")};
  padding: 2px 15px;
  border-radius: 20px;
  color: ${({ active }) => (active ? "#30bd9f" : "#546978")};
  &::after {
    content: ${({ active }) => (active ? `"Topic active"` : `"Topic closed"`)};
  }
`;

const Heading = styled.p`
  color: #1f2c3c;
  font-size: ${fonts.size.xlarge};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? "block" : "none")};
  }
`;

const Descend = styled.div`
  margin-top: 14px;
  margin-right: 10px;
  height: 10px;
  width: 16px;
  cursor: pointer;
  background: url(${descend}) no-repeat;
  transition: ${transitions.base};
  transform: ${({ flip }) => (flip ? "rotate(180deg)" : "")};
`;

class CardTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapse: props.startCollapsed };
  }
  toggleCollapse = () => {
    if (!this.props.collapsable) return;
    this.setState(state => ({ collapse: !state.collapse }));
  };
  render() {
    const { minHeight, topic, active, collapsable } = this.props;
    const { collapse } = this.state;
    return (
      <CardTopWrapper minHeight={minHeight} collapse={collapse}>
        <div style={{ display: "flex" }}>
          {collapsable ? (
            <Descend flip={collapse} onClick={this.toggleCollapse} />
          ) : null}
          <Link to={`/${toSlug(topic)}`}>
            <Heading>{topic}</Heading>
          </Link>
        </div>
        <TopicStatus active={active} />
      </CardTopWrapper>
    );
  }
}

CardTop.defaultProps = {
  minHeight: 48
};

export default Card;
export { CardTop, CardElement };