import React, { Component } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Svg, { Line } from "react-native-svg";
const Sample = [
  {
    id: "656edbcc0c20bdb041e073fa",
    fullname: "Nguyen Van A",
    gender: "Nam",
    dob: "2003-11-28",
    dod: "",
    spouse: [
      {
        id: "656edbce0c20bdb041e07400",
        fullname: "Nguyen Thi B",
        gender: "Nữ",
        dob: "",
        dod: "",
      },
    ],
    children: [
      {
        id: "656f334e75c24242efd927b3",
        fullname: "Nguyen Thi P",
        gender: "Nữ",
        dob: "",
        dod: "",
        spouse: [],
        children: [],
      },
      {
        id: "656f334f75c24242efd927b5",
        fullname: "Nguyễn Văn Hoàng",
        gender: "Nam",
        dob: "",
        dod: "",
        spouse: [
          {
            id: "656f33c675c24242efd927c1",
            fullname: "Hoàng Thị Hồng",
            gender: "Nữ",
            dob: "",
            dod: "",
          },
          {
            id: "656f33c675c24242efd927c3",
            fullname: "Hoàng Thị Hà",
            gender: "Nữ",
            dob: "2001-12-12",
            dod: "",
          },
        ],
        children: [],
      },
    ],
  },
];

export default class FamilyTree extends Component {
  constructor(props) {
    super(props);
  }

  hasChildren(member) {
    return member.children && member.children.length > 0;
  }

  renderTree(data, level) {
    return (
      <FlatList
        data={data}
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: "25%" }}
        keyExtractor={(item, index) => `${item.fullname} + ${item.spouse}`}
        listKey={(item, index) => `${item.fullname} + ${item.spouse}`}
        initialScrollIndex={0}
        renderItem={({ item, index }) => {
          const { id, fullname, spouse, dob, dod, image } = item;
          const info = { id, fullname, spouse, dob, dod, image };
          var date_of_birth = "";
          if (info.dob){
            date_of_birth = new Date(info.dob);
          }
          var date_of_dead = "";
          if (info.dod){
            date_of_dead = new Date(info.dod);
          }
          return (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: this.props.siblingGap / 2,
                paddingRight: this.props.siblingGap / 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("DetailMember", {s_id: info.id, updateTree: this.props.updateTree })}
                >
                  <View
                    style={{
                      ...this.props.nodeStyle,
                    }}
                  >
                    <View
                      style={{
                        ...this.props.nodeImageStyle,
                      }}
                    >
                      <Image
                        style={{ ...this.props.imageStyle }}
                        source={{ uri: info.image }}
                      />
                    </View>
                    <View style={{ ...this.props.textStyle }}>
                      <Text
                        style={{
                          ...this.props.nodeTitleStyle,
                          color: this.props.nodeTitleColor,
                        }}
                      >
                        {info.fullname}
                      </Text>
                      {info.dob ? (
                        <Text
                          style={{
                            ...this.props.nodeInfoStyle,
                            color: this.props.nodeInfoColor,
                          }}
                        >
                          Sinh: {date_of_birth.toLocaleDateString('en-GB')}
                        </Text>
                      ) : null}
                      {info.dod ? (
                        <Text
                          style={{
                            ...this.props.nodeInfoStyle,
                            color: this.props.nodeInfoColor,
                          }}
                        >
                          Mất: {date_of_dead.toLocaleDateString('en-GB')}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {this.hasChildren(item) && (
                <Svg height="50" width="20">
                  <Line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="150"
                    stroke={this.props.pathColor}
                    strokeWidth={this.props.strokeWidth}
                  />
                </Svg>
              )}
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {this.hasChildren(item) &&
                  item.children.map((child, index) => {
                    const { fullname, spouse, dob, dod, image } = child;
                    const info = { fullname, spouse, dob, dod, image };
                    return (
                      <View
                        key={child.fullname + child.spouse}
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <View>
                          <Svg height="50" width="100%">
                            <Line
                              x1="50%"
                              y1="0"
                              x2="50%"
                              y2="100%"
                              stroke={this.props.pathColor}
                              strokeWidth={this.props.strokeWidth}
                            />
                            {/* Right side horizontal line */}
                            {this.hasChildren(item) &&
                              item.children.length != 1 &&
                              item.children.length - 1 !== index && (
                                <Line
                                  x1="100%"
                                  y1={this.props.strokeWidth / 2}
                                  x2="50%"
                                  y2={this.props.strokeWidth / 2}
                                  stroke={this.props.pathColor}
                                  strokeWidth={this.props.strokeWidth}
                                />
                              )}
                            {/* Left side horizontal line */}
                            {this.hasChildren(item) &&
                              item.children.length != 1 &&
                              index !== 0 && (
                                <Line
                                  x1="50%"
                                  y1={this.props.strokeWidth / 2}
                                  x2="0"
                                  y2={this.props.strokeWidth / 2}
                                  stroke={this.props.pathColor}
                                  strokeWidth={this.props.strokeWidth}
                                />
                              )}
                          </Svg>
                          {this.renderTree([child], level + 1)}
                        </View>
                        {}
                        <View
                          style={{
                            height: this.props.strokeWidth,
                            backgroundColor:
                              this.hasChildren(item) &&
                              item.children.length - 1 !== index
                                ? this.props.pathColor
                                : "transparent",
                            width:
                              this.hasChildren(child) &&
                              child.children.length - 1 !== index
                                ? level * this.props.familyGap
                                : 0,
                          }}
                        />
                      </View>
                    );
                  })}
              </View>
            </View>
          );
        }}
      />
    );
  }

  render() {
    const { title, titleStyle, titleColor } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ ...titleStyle, color: titleColor }}>{title}</Text>
        {this.renderTree(this.props.data, 1)}
      </View>
    );
  }
}

FamilyTree.defaultProps = {
  title: "My Family Tree",
  titleStyle: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  titleColor: "black",
  data: Sample,
  nodeStyle: {
    width: 100,
    height: 100,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  nodeTitleStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  pathColor: "#00ffd8",
  siblingGap: 50,
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    resizeMode: "cover",
  },
  nodeTitleColor: "#00ff00",
  familyGap: 30,
  strokeWidth: 5,
};

FamilyTree.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  data: PropTypes.array,
  nodeStyle: PropTypes.object,
  nodeTitleStyle: PropTypes.object,
  pathColor: PropTypes.string,
  siblingGap: PropTypes.number,
  imageStyle: PropTypes.object,
  nodeTitleColor: PropTypes.string,
  familyGap: PropTypes.number,
  strokeWidth: PropTypes.number,
  titleColor: PropTypes.string,
};
