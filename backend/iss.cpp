#include <bits/stdc++.h>
using namespace std;

bool isOperator(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}

bool isOperand(char c) {
    return c >= 'A' && c <= 'Z';
}

string validateExpression(const string &expr) {
    if (expr.empty()) return "Expression is empty.";

    int balance = 0;
    char prev = '\0';
    for (size_t i = 0; i < expr.size(); ++i) {
        char c = expr[i];
        if (c == ' ') continue;
        if (isOperand(c)) {
            if (prev == ')' ) return "Invalid token sequence: operand after ')'.";
        } else if (isOperator(c)) {
            if (i == 0 || prev == '\0' || isOperator(prev) || prev == '(') {
                return "Invalid operator placement near '" + string(1, c) + "'.";
            }
        } else if (c == '(') {
            if (isOperand(prev) || prev == ')') return "Invalid token sequence before '('.";
            balance++;
        } else if (c == ')') {
            if (prev == '\0' || isOperator(prev) || prev == '(') {
                return "Invalid token placement near ')'.";
            }
            balance--;
            if (balance < 0) return "Mismatched parentheses.";
        } else {
            return "Unsupported character '" + string(1, c) + "'. Use A-Z and + - * / ( ).";
        }
        if (c != ' ') prev = c;
    }

    if (isOperator(prev) || prev == '(') {
        return "Expression ends with an invalid operator or open parenthesis.";
    }
    if (balance != 0) {
        return "Mismatched parentheses.";
    }
    return "";
}

string infixToPostfix(const string &expr) {
    string output;
    stack<char> st;

    for (char ch : expr) {
        if (ch == ' ') continue;
        if (isOperand(ch)) {
            output.push_back(ch);
        } else if (ch == '(') {
            st.push(ch);
        } else if (ch == ')') {
            while (!st.empty() && st.top() != '(') {
                output.push_back(st.top());
                st.pop();
            }
            if (!st.empty()) st.pop();
        } else if (isOperator(ch)) {
            while (!st.empty() && isOperator(st.top()) && precedence(st.top()) >= precedence(ch)) {
                output.push_back(st.top());
                st.pop();
            }
            st.push(ch);
        }
    }

    while (!st.empty()) {
        output.push_back(st.top());
        st.pop();
    }

    return output;
}

struct InstructionSet {
    vector<string> threeAddress;
    vector<string> twoAddress;
    vector<string> oneAddress;
    vector<string> zeroAddress;
};

InstructionSet generateInstructions(const string &postfix) {
    InstructionSet result;
    stack<string> nodes;
    int tempCount = 0;
    int regCount = 0;
    int storedCount = 0;

    struct NodeInfo {
        string name;
        vector<string> code3;
        vector<string> code2;
        vector<string> code1;
        vector<string> code0;
    };

    stack<NodeInfo> parseStack;

    for (char token : postfix) {
        if (isOperand(token)) {
            string op(1, token);
            parseStack.push({op, {}, {}, {}, {"PUSH " + op}});
            continue;
        }

        NodeInfo right = parseStack.top(); parseStack.pop();
        NodeInfo left = parseStack.top(); parseStack.pop();

        tempCount++;
        string temp = "T" + to_string(tempCount);
        string op;
        string mnemonic;
        if (token == '+') {
            op = " + ";
            mnemonic = "ADD";
        } else if (token == '-') {
            op = " - ";
            mnemonic = "SUB";
        } else if (token == '*') {
            op = " * ";
            mnemonic = "MUL";
        } else {
            op = " / ";
            mnemonic = "DIV";
        }

        vector<string> merged3 = left.code3;
        merged3.insert(merged3.end(), right.code3.begin(), right.code3.end());
        merged3.push_back(temp + " = " + left.name + op + right.name);

        vector<string> merged2 = left.code2;
        merged2.insert(merged2.end(), right.code2.begin(), right.code2.end());
        regCount++;
        string r = "R" + to_string(regCount);
        merged2.push_back("MOV " + r + ", " + left.name);
        merged2.push_back(mnemonic + " " + r + ", " + right.name);

        vector<string> merged1 = left.code1;
        merged1.insert(merged1.end(), right.code1.begin(), right.code1.end());
        merged1.push_back("LOAD " + left.name);
        merged1.push_back(mnemonic + " " + right.name);
        merged1.push_back("STORE " + temp);

        vector<string> merged0 = left.code0;
        merged0.insert(merged0.end(), right.code0.begin(), right.code0.end());
        merged0.push_back(mnemonic);

        parseStack.push({temp, merged3, merged2, merged1, merged0});
    }

    if (!parseStack.empty()) {
        auto finalNode = parseStack.top();
        result.threeAddress = finalNode.code3;
        result.twoAddress = finalNode.code2;
        result.oneAddress = finalNode.code1;
        result.zeroAddress = finalNode.code0;
    }

    return result;
}

int main() {
    cout << "Instruction Set Simulator\n";
    cout << "Enter expression: ";
    string expr;
    getline(cin, expr);

    string error = validateExpression(expr);
    if (!error.empty()) {
        cout << "Error: " << error << "\n";
        return 1;
    }

    string postfix = infixToPostfix(expr);
    InstructionSet instructions = generateInstructions(postfix);

    cout << "Postfix: " << postfix << "\n\n";
    cout << "Three Address Code:\n";
    for (auto &line : instructions.threeAddress) cout << line << '\n';
    cout << "Instruction Count: " << instructions.threeAddress.size() << "\n\n";

    cout << "Two Address Code:\n";
    for (auto &line : instructions.twoAddress) cout << line << '\n';
    cout << "Instruction Count: " << instructions.twoAddress.size() << "\n\n";

    cout << "One Address Code:\n";
    for (auto &line : instructions.oneAddress) cout << line << '\n';
    cout << "Instruction Count: " << instructions.oneAddress.size() << "\n\n";

    cout << "Zero Address Code:\n";
    for (auto &line : instructions.zeroAddress) cout << line << '\n';
    cout << "Instruction Count: " << instructions.zeroAddress.size() << "\n";

    return 0;
}
