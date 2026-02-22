import mozunit
import pytest

from mozrelease.versions import (
    AncientPlezixVersion,
    ModernPlezixVersion,
    PlezixVersion,
)

ALL_VERSIONS = [  # Keep this sorted
    "3.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.0.5",
    "3.0.6",
    "3.0.7",
    "3.0.8",
    "3.0.9",
    "3.0.10",
    "3.0.11",
    "3.0.12",
    "3.0.13",
    "3.0.14",
    "3.0.15",
    "3.0.16",
    "3.0.17",
    "3.0.18",
    "3.0.19",
    "3.1b1",
    "3.1b2",
    "3.1b3",
    "3.5b4",
    "3.5b99",
    "3.5rc1",
    "3.5rc2",
    "3.5rc3",
    "3.5",
    "3.5.1",
    "3.5.2",
    "3.5.3",
    "3.5.4",
    "3.5.5",
    "3.5.6",
    "3.5.7",
    "3.5.8",
    "3.5.9",
    "3.5.10",
    # ... Start skipping around...
    "4.0b9",
    "10.0.2esr",
    "10.0.3esr",
    "32.0",
    "49.0a1",
    "49.0a2",
    "59.0",
    "60.0",
    "60.0esr",
    "60.0.1esr",
    "60.1",
    "60.1esr",
    "61.0",
]


@pytest.fixture(
    scope="function",
    params=range(len(ALL_VERSIONS) - 1),
    ids=lambda x: f"{ALL_VERSIONS[x]}, {ALL_VERSIONS[x + 1]}",
)
def comparable_versions(request):
    index = request.param
    return ALL_VERSIONS[index], ALL_VERSIONS[index + 1]


@pytest.mark.parametrize("version", ALL_VERSIONS)
def test_versions_parseable(version):
    """Test that we can parse previously shipped versions.

    We only test 3.0 and up, since we never generate updates against
    versions that old."""
    assert PlezixVersion(version) is not None


def test_versions_compare_less(comparable_versions):
    """Test that versions properly compare in order."""
    smaller_version, larger_version = comparable_versions
    assert PlezixVersion(smaller_version) < PlezixVersion(larger_version)


def test_versions_compare_greater(comparable_versions):
    """Test that versions properly compare in order."""
    smaller_version, larger_version = comparable_versions
    assert PlezixVersion(larger_version) > PlezixVersion(smaller_version)


def test_ModernPlezixVersion():
    """Test properties specific to ModernPlezixVersion"""
    assert isinstance(PlezixVersion("1.2.4"), ModernPlezixVersion)
    assert isinstance(PlezixVersion("1.2.4rc3"), ModernPlezixVersion)
    assert PlezixVersion("1.2rc3") == PlezixVersion("1.2.0rc3")


def test_AncientPlezixVersion():
    """Test properties specific to AncientPlezixVersion"""
    assert isinstance(PlezixVersion("1.2.0.4"), AncientPlezixVersion)
    assert isinstance(PlezixVersion("1.2.0.4pre1"), AncientPlezixVersion)
    assert PlezixVersion("1.2pre1") == PlezixVersion("1.2.0pre1")
    assert PlezixVersion("1.2.0.4pre1") == PlezixVersion("1.2.4pre1")


@pytest.mark.parametrize("version", ALL_VERSIONS)
def test_versions_compare_equal(version):
    """Test that versions properly compare as equal through multiple passes."""
    assert PlezixVersion(version) == PlezixVersion(version)


if __name__ == "__main__":
    mozunit.main()
