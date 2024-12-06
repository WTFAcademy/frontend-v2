export const quizData = [
    {
        "title": "## 1.已知foo是一个未实现的函数，那么下面代码中书写正确的是？\n",
        "meta": {
            "type": "select",
            "id": 967,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [],
            "options": [
                {
                    "label": "`abstract contract A{ function foo(uint a) internal pure virtual returns(uint); }`",
                    "value": "A"
                },
                {
                    "label": "`abstract contract A{ function foo(uint a) public view returns(uint); }`",
                    "value": "B"
                },
                {
                    "label": "`contract A{ function foo(uint a) external pure virtual returns(uint); }`",
                    "value": "C"
                },
                {
                    "label": "`contract A{ function foo(uint a) internal returns(uint); }`",
                    "value": "D"
                }
            ]
        }
    },
    {
        "title": "## 2.被标记为abstract的合约能否被部署？\n",
        "meta": {
            "type": "select",
            "id": 968,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [],
            "options": [
                {
                    "label": "能",
                    "value": "A"
                },
                {
                    "label": "不能",
                    "value": "B"
                },
                {
                    "label": "如果实现了所有函数的子合约已经被部署，则该合约能被部署",
                    "value": "C"
                }
            ]
        }
    },
    {
        "title": "## 3.下列关于接口的规则中，错误的是\n",
        "meta": {
            "type": "select",
            "id": 969,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [],
            "options": [
                {
                    "label": "不能包含状态变量",
                    "value": "A"
                },
                {
                    "label": "不能包含构造函数",
                    "value": "B"
                },
                {
                    "label": "不能继承除接口外的其他合约",
                    "value": "C"
                },
                {
                    "label": "所有函数都必须是external且不能有函数体",
                    "value": "D"
                },
                {
                    "label": "继承接口的合约可以不实现接口定义的全部功能",
                    "value": "E"
                }
            ]
        }
    },
    {
        "title": "## 4.下列关于接口的描述，错误的是\n",
        "meta": {
            "type": "select",
            "id": 970,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [],
            "options": [
                {
                    "label": "接口提供了合约里每个函数的选择器",
                    "value": "A"
                },
                {
                    "label": "接口提供了每个函数的函数签名",
                    "value": "B"
                },
                {
                    "label": "接口提供了自身的接口id",
                    "value": "C"
                },
                {
                    "label": "接口与合约ABI等价，可以相互转换",
                    "value": "D"
                },
                {
                    "label": "如果已知一个合约实现了IERC20接口，那么还需要知道它具体代码实现，才可以与之交互",
                    "value": "E"
                }
            ]
        }
    },
    {
        "title": "## 5.已知Azuki的合约地址为`0xED5AF388653567Af2F388E6224dC7C4b3241C544`，那么利用该地址创建接口合约变量的语句是\n",
        "meta": {
            "type": "select",
            "id": 971,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [],
            "options": [
                {
                    "label": "IERC721 Azuki = IERC721(0xED5AF388653567Af2F388E6224dC7C4b3241C544)",
                    "value": "A"
                },
                {
                    "label": "IERC721 Azuki = \"0xED5AF388653567Af2F388E6224dC7C4b3241C544\"",
                    "value": "B"
                },
                {
                    "label": "IERC721 Azuki = abstract(0xED5AF388653567Af2F388E6224dC7C4b3241C544)",
                    "value": "C"
                },
                {
                    "label": "IERC721 Azuki = interface(0xED5AF388653567Af2F388E6224dC7C4b3241C544)",
                    "value": "D"
                }
            ]
        }
    },
    {
        "title": "## 6.已知Azuki合约中存在ownerOf(uint256 tokenId)函数可用来查询某一NFT的拥有者，现在vitalik想利用上文中创建的接口合约变量调用这一函数，并写出了如下代码：\n",
        "meta": {
            "type": "select",
            "id": 972,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [
                {
                    "type": "code",
                    "raw": "```solidity\nfunction  ownerOfAzuki(uint256 id) external view returns (address){ \n      _________________________________\n }\n那么下面哪个选项可以填在横线处？\n```"
                },
                {
                    "type": "space",
                    "raw": "\n\n"
                }
            ],
            "options": [
                {
                    "label": "`return Azuki.ownerOf(id);`",
                    "value": "A"
                },
                {
                    "label": "`return ownerOf(id);`",
                    "value": "B"
                },
                {
                    "label": "`return Azuki.ownerOfAzuki(id);`",
                    "value": "C"
                },
                {
                    "label": "`return Azuki(ownerOf, id);`",
                    "value": "D"
                }
            ]
        }
    },
    {
        "title": "## 7.已知Azuki合约中存在approve(address to, uint256 tokenId)函数可以让NFT的拥有者将自己某一NFT的许可权授予另一地址，且该函数没有返回值，现在某个Azuki拥有者想利用上文中创建的接口合约变量调用这一函数  ，那么他写出的代码可能是？\n",
        "meta": {
            "type": "select",
            "id": 973,
            "score": 1,
            "answer": null
        },
        "content": {
            "extend": [],
            "options": [
                {
                    "label": "`function  approveAzuki(address to, uint256 id) external{ Azuki.approve(to, id);}`",
                    "value": "A"
                },
                {
                    "label": "`function  approveAzuki(address to, uint256 id) external view { Azuki.approve(to, id);}`",
                    "value": "B"
                },
                {
                    "label": "`function  approveAzuki(address to, uint256 id) external returns(bool){ Azuki.approve(to, id);}`",
                    "value": "C"
                },
                {
                    "label": "`function  approveAzuki(address to, uint256 id) external view returns(bool){ Azuki.approve(to, id);}`",
                    "value": "D"
                }
            ]
        }
    }
]