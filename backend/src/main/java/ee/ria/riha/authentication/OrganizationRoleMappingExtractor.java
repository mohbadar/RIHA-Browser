package ee.ria.riha.authentication;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class OrganizationRoleMappingExtractor {

    private static final Pattern COMMON_NAME_VALIDATION_PATTERN = Pattern.compile("^(.+)-([a-zA-Z_]+)$");

    public OrganizationRoleMapping extract(String commonName, String displayName) {
        OrganizationRoleMapping organizationRoleMapping = new OrganizationRoleMapping();

        if (commonName == null) {
            log.debug("Could not find common name of organization '{}'", displayName);
            return null;
        }

        Matcher commonNameMatcher = COMMON_NAME_VALIDATION_PATTERN.matcher(commonName);
        if (!commonNameMatcher.matches()) {
            log.debug("Organization common name '{}' does not match validation pattern", commonName);
            return null;
        }

        organizationRoleMapping.setCode(commonNameMatcher.group(1));
        organizationRoleMapping.setAuthority(new SimpleGrantedAuthority(RihaLdapUserDetailsContextMapper.ROLE_PREFIX +
                commonNameMatcher.group(2).toUpperCase()));
        organizationRoleMapping.setName(displayName);

        return organizationRoleMapping;
    }
}
