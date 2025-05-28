import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface PaginationHeaderProps {
  allExercises: any[];
  currentPage: number;
  handlePageChange: (index: number) => void;
}

export function PaginationHeader({
  allExercises,
  currentPage,
  handlePageChange,
}: PaginationHeaderProps) {
  const total = allExercises.length;

  if (total === 0) return null;

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        key="prev"
        onPress={() => handlePageChange(Math.max(0, currentPage - 1))}
        style={[styles.pageNavButton, { marginRight: 10 }]}
        disabled={currentPage === 0}
      >
        <Text
          style={[
            styles.pageButtonText,
            currentPage === 0 && styles.activeButtonText,
          ]}
        >
          Prev
        </Text>
      </TouchableOpacity>
      {total <= 4 ? (
        allExercises.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePageChange(index)}
            style={[
              styles.pageButton,
              currentPage === index && styles.activePageButton,
            ]}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === index && styles.activePageButtonText,
              ]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <>
          {/* Start: 1 2 3 ... N */}
          {currentPage < 2 && (
            <>
              {[0, 1, 2].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePageChange(index)}
                  style={[
                    styles.pageButton,
                    currentPage === index && styles.activePageButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.pageButtonText,
                      currentPage === index && styles.activePageButtonText,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.ellipsis}>...</Text>
              <TouchableOpacity
                key={total - 1}
                onPress={() => handlePageChange(total - 1)}
                style={[
                  styles.pageButton,
                  currentPage === total - 1 && styles.activePageButton,
                ]}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === total - 1 && styles.activePageButtonText,
                  ]}
                >
                  {total}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Middle: n n+1 n+2 ... N */}
          {currentPage >= 2 && currentPage < total - 2 && (
            <>
              <TouchableOpacity
                key={currentPage - 1}
                onPress={() => handlePageChange(currentPage - 1)}
                style={[
                  styles.pageButton,
                  currentPage === currentPage - 1 && styles.activePageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>{currentPage}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                key={currentPage}
                onPress={() => handlePageChange(currentPage)}
                style={[styles.pageButton, styles.activePageButton]}
              >
                <Text style={styles.activePageButtonText}>
                  {currentPage + 1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                key={currentPage + 1}
                onPress={() => handlePageChange(currentPage + 1)}
                style={[
                  styles.pageButton,
                  currentPage === currentPage + 1 && styles.activePageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>{currentPage + 2}</Text>
              </TouchableOpacity>
              <Text style={styles.ellipsis}>...</Text>
              <TouchableOpacity
                key={total - 1}
                onPress={() => handlePageChange(total - 1)}
                style={[
                  styles.pageButton,
                  currentPage === total - 1 && styles.activePageButton,
                ]}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === total - 1 && styles.activePageButtonText,
                  ]}
                >
                  {total}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* End: 1 ... N-2 N-1 N */}
          {currentPage >= total - 2 && (
            <>
              <TouchableOpacity
                key={0}
                onPress={() => handlePageChange(0)}
                style={[
                  styles.pageButton,
                  currentPage === 0 && styles.activePageButton,
                ]}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === 0 && styles.activePageButtonText,
                  ]}
                >
                  1
                </Text>
              </TouchableOpacity>
              <Text style={styles.ellipsis}>...</Text>
              {[total - 3, total - 2, total - 1].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePageChange(index)}
                  style={[
                    styles.pageButton,
                    currentPage === index && styles.activePageButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.pageButtonText,
                      currentPage === index && styles.activePageButtonText,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </>
      )}
      <TouchableOpacity
        key="next"
        onPress={() => handlePageChange(Math.min(total - 1, currentPage + 1))}
        style={[styles.pageNavButton, { marginLeft: 10 }]}
        disabled={currentPage === total - 1}
      >
        <Text
          style={[
            styles.pageButtonText,
            currentPage === total - 1 && styles.activeButtonText,
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 30,
    paddingHorizontal: 10,
    alignItems: "center",
    zIndex: 10, // <-- Add this line
  },
  pageButton: {
    backgroundColor: "#343535",
    borderRadius: 8,
    marginHorizontal: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pageNavButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activePageButton: {
    fontSize: 16,
    backgroundColor: "#007AFF",
  },
  activeButtonText: {
    color: "#343535",
    fontSize: 16,
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  activePageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  ellipsis: {
    color: "#fff",
    fontSize: 18,
    marginHorizontal: 8,
  },
});
