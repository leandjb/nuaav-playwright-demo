import testUsers from '../test-data/sauce-demo-users.json';

export interface TestUser {
  username: string;
  password: string;
  description: string;
  expectedResult: 'success' | 'error';
  expectedUrl: string;
  expectedTitle?: string;
  expectedError?: string;
  hasUIIssues?: boolean;
  hasPerformanceIssues?: boolean;
  hasCheckoutIssues?: boolean;
  hasVisualIssues?: boolean;
  expectedLoginDelay?: number;
}

export class TestDataHelper {
  /**
   * Get all test users
   */
  static getAllUsers(): (TestUser & { key: string })[] {
    return Object.entries(testUsers).map(([key, user]) => ({
      key,
      ...(user as TestUser),
    }));
  }

  /**
   * Get users filtered by expected result
   */
  static getUsersByResult(expectedResult: 'success' | 'error'): (TestUser & { key: string })[] {
    return this.getAllUsers().filter((user) => user.expectedResult === expectedResult);
  }

  /**
   * Get users with specific issues
   */
  static getUsersWithIssues(issueType: 'UI' | 'Performance' | 'Checkout' | 'Visual'): (TestUser & {
    key: string;
  })[] {
    const issuePropertyMap: Record<typeof issueType, keyof TestUser> = {
      UI: 'hasUIIssues',
      Performance: 'hasPerformanceIssues',
      Checkout: 'hasCheckoutIssues',
      Visual: 'hasVisualIssues',
    };
  
    const propertyName = issuePropertyMap[issueType];
    
    return this.getAllUsers().filter((user) => user[propertyName]);
  }
  

  /**
   * Get a specific user by key
   */
  static getUserByKey(key: string): (TestUser & { key: string }) | undefined {
    const user = testUsers[key as keyof typeof testUsers];
    return user ? { key, ...(user as TestUser) } : undefined;
  }

  /**
   * Get users that require slow timeout
   */
  static getSlowUsers(): (TestUser & { key: string })[] {
    return this.getAllUsers().filter(
      (user) => user.hasPerformanceIssues || user.expectedLoginDelay
    );
  }
}
